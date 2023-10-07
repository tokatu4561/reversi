<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use App\Consts\BaseConsts;
use App\Models\ComingSoonProduct;
use App\Models\NewArrivalProduct;
use App\Models\Product;
use App\Models\ProductClass;
use Illuminate\Support\Facades\Date;
use Tests\ApiTestCase;

class ProductTest extends ApiTestCase
{

    // 指定したIDの商品が取れているか
    public function test_the_product_id_response()
    {
        $response = $this->get('/api/product/510');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'product' => [
                        'id' => 510,
                        'name' => 'ベーシックキャミ(3colors)',
                        'classes' => [
                            '0' => ['name' => 'ブラック'],
                            '1' => ['name' => 'ライトグレー'],
                            '2' => [
                                'name' => 'チャコールグレー',
                                'class_category_id' => 39,
                            ],
                        ]
                    ]
                ]
            ]);
    }

    // 指定したIDの商品が在庫なしと表示されるか
    public function test_the_product_id_no_stock_response()
    {
        $response = $this->get('/api/product/2705');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'product' => [
                        'id' => 2705,
                        'name' => 'レースショートパンツ(アイボリー)',
                        'classes' => [
                            '1' => ['name' => 'S (在庫なし)'],
                            '0' => ['name' => 'M (在庫なし)'],
                        ],
                    ],
                ],
            ]);
    }


    // 商品リストが取れているか
    public function test_the_products_list_response()
    {
        $response = $this->get('/api/product/');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'products' => [
                        '3' => [
                            'id' => 7162,
                        ],
                    ],
                ]
            ]);
    }

    // 商品の検索
    public function test_the_products_list_search()
    {
        $response = $this->get(route("product.list", ['product_name' => ['シャツ','カーキ']]));
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'products' => [
                        '0' => [
                            'id' => 6551,
                        ],
                        '1' => [
                            'id' => 5781,
                        ],
                    ],
                ]
            ]);

        //　検索したキーワード以外の商品が含まれていない
        // $response->assertJsonMissing([
        //         'data' => [
        //             'products' => [
        //                 '3' => [
        //                     'id' => 1341
        //                 ],
        //             ],
        //         ]
        //     ]);
    }

    // 存在しない商品が404となるか
    public function test_the_products_404_response()
    {
        $response = $this->get('/api/product/1');
        $response->assertStatus(404);
    }

    // 商品お気に入りのテスト
    public function test_favorite_product()
    {
        $user = User::factory()->has(Customer::factory())->create();
        // FIXME: 商品はfactoryで作成
        $productId = 510;
        $this->login($user);
        $this->post('/api/user/favorite/' . $productId)->assertStatus(200);
        
        $this->assertDatabaseHas('favorite_product', [
            'user_id' => $user->id,
            'product_id' => $productId
        ]);

        // 異常系: 既にお気に入り登録済みの場合 400
        $this->post('/api/user/favorite/' . $productId)->assertStatus(400);
    }

    // 商品お気に入り解除のテスト
    public function test_not_favorite_product()
    {
        $user = User::factory()->has(Customer::factory())->create();
        $productId = 510;
        $this->login($user);
        $this->post('/api/user/favorite/' . $productId)->assertStatus(200);
        $this->delete('/api/user/favorite/' . $productId)->assertStatus(200);

        $this->assertDatabaseMissing('favorite_product', [
            'user_id' => $user->id,
            'product_id' => $productId
        ]);
    }
    
    // 在庫切れの商品の再入荷リクエストができるか
    // 再入荷リクエストを受け付けた旨のメールが送信されるか
    public function test_product_restock_request()
    {
        // ログインする
        $user = $this->createUser();
        $this->login($user);

        $noStockProduct = Product::factory()->create(['reserv_flg' => 0]);
        ProductClass::create([
            'product_id'        => $noStockProduct->id,
            'classcategory_id1' => 1,
            'product_code'      => '1234512345',
            'stock'             => 0, // 在庫切れ
            'sale_limit'        => 5,
            'price02'           => 2000,
            'is_hide'           => false
        ]);

        // Smock 1件通知されることを確認
        $aws = \Mockery::mock('Aws\Sqs\SqsClient');
        $this->app->instance('aws', $aws);
        $aws->shouldReceive('createClient')->once()->andReturn($aws);
        $aws->shouldReceive('sendMessage')->once();

        // 再入荷をリクエストする
        $response = $this->postJson('/api/product/restock',
                [
                    'product_id' => $noStockProduct->id,
                    'class_category_id' => 1
                ]
            );
        $response->assertStatus(200);

        // 再入荷リクエストのレコードが存在するか
        $this->assertDatabaseHas('restock_requests', [
            'product_class_id'  => $noStockProduct->classes->first()->id,
            'user_id'           => $user->id,
        ]);
    }

    /**
     * coming soon 商品一覧取得のテスト
     */
    public function test_get_coming_soon_products_list()
    {
        // 販売開始後の coming soon 商品を作成
        $product = $this->createProductWithClass([
            'status' => 1,
            'sales_start_date' => Date::now()->subMinute()->format('Y-m-d H:i:s')
        ]);
        ComingSoonProduct::factory([
            'product_id' => $product->id
        ])->create();
        
        // coming soon 商品一覧取得　販売開始後の商品は含まれない
        $response = $this->get('/api/product/coming-soon');
        $response->assertStatus(404)
            ->assertJson([
                'data' => []
            ]);

        // 販売開始前の coming soon 商品を作成
        $product = $this->createProductWithClass([
            'status' => 1,
            'sales_start_date' => Date::now()->addMinute()->format('Y-m-d H:i:s') //販売開始前
        ], []);
        ComingSoonProduct::factory([
            'product_id' => $product->id
        ])->create();

        // coming soon 商品一覧取得　販売開始前の商品が含まれる
        $response = $this->get('/api/product/coming-soon');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'products' => [
                        '0' => [
                            'id' => $product->id,
                        ],
                    ],
                ]
            ]);
    }

    /**
     * new arrival 商品一覧取得のテスト
     */
    public function test_get_new_arrival_products_list()
    {
        // 販売開始前 の　new arrival 商品を作成販
        $product = $this->createProductWithClass([
            'status' => 1,
            'sales_start_date' => Date::now()->addMinute()->format('Y-m-d H:i:s')
        ]);
        NewArrivalProduct::factory()->create([
            'product_id' => $product->id,
        ]);

        // new arrival 商品一覧取得　販売開始前の商品は含まれないので空
        $response = $this->get('/api/product/new-arrival');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'products' => [],
                ]
            ]);

        // 販売開始後 の　new arrival 商品を作成販
        $product = $this->createProductWithClass([
            'status' => 1,
            'sales_start_date' => Date::now()->subMinute()->format('Y-m-d H:i:s')
        ]);
        NewArrivalProduct::factory()->create([
            'product_id' => $product->id,
        ]);

        // new arrival 商品一覧取得　販売開始後の商品は含まれる
        $response = $this->get('/api/product/new-arrival');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'products' => [
                        '0' => [
                            'id' => $product->id,
                        ],
                    ],
                ]
            ]);
    }
}

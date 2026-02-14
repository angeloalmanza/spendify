<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private function authenticatedUser(): array
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [$user, $token];
    }

    public function test_user_can_list_categories(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $user->categories()->create(['name' => 'Cibo']);
        $user->categories()->create(['name' => 'Svago']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(2);
    }

    public function test_user_can_create_category(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['name' => 'Trasporti']);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Trasporti']);
    }

    public function test_creating_same_category_twice_returns_existing(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['name' => 'Cibo']);

        $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', ['name' => 'Cibo']);

        $this->assertDatabaseCount('categories', 1);
    }

    public function test_user_cannot_see_other_users_categories(): void
    {
        [$user1,] = $this->authenticatedUser();
        $user1->categories()->create(['name' => 'Cibo']);

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    public function test_user_can_delete_category(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $category = $user->categories()->create(['name' => 'Cibo']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_user_cannot_delete_other_users_category(): void
    {
        [$user1,] = $this->authenticatedUser();
        $category = $user1->categories()->create(['name' => 'Cibo']);

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_create_category_validates_name_required(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/categories', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_unauthenticated_user_cannot_access_categories(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(401);
    }

    public function test_default_categories_created_on_registration(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);

        $user = User::where('email', 'new@example.com')->first();
        $categories = $user->categories()->orderBy('name')->get();

        $this->assertCount(5, $categories);
        $this->assertEquals(
            ['Affitto', 'Altro', 'Cibo', 'Stipendio', 'Svago'],
            $categories->pluck('name')->toArray()
        );

        foreach ($categories as $category) {
            $this->assertNotNull($category->color, "Category '{$category->name}' should have a color");
            $this->assertMatchesRegularExpression('/^#[0-9a-fA-F]{6}$/', $category->color);
        }
    }

    public function test_user_can_update_category_name_and_color(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $category = $user->categories()->create(['name' => 'Cibo', 'color' => '#eab308']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/categories/{$category->id}", [
                'name' => 'Alimentari',
                'color' => '#f59e0b',
            ]);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Alimentari', 'color' => '#f59e0b']);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Alimentari',
            'color' => '#f59e0b',
        ]);
    }

    public function test_user_cannot_update_other_users_category(): void
    {
        [$user1,] = $this->authenticatedUser();
        $category = $user1->categories()->create(['name' => 'Cibo', 'color' => '#eab308']);

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->putJson("/api/categories/{$category->id}", [
                'name' => 'Hacked',
            ]);

        $response->assertStatus(404);
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Cibo']);
    }

    public function test_update_category_validates_color_format(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $category = $user->categories()->create(['name' => 'Cibo', 'color' => '#eab308']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/categories/{$category->id}", [
                'color' => 'not-a-color',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['color']);
    }
}

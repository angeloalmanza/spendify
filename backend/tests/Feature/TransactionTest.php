<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
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

    private function transactionData(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Spesa supermercato',
            'amount' => 50.00,
            'type' => 'expense',
            'category' => 'Cibo',
            'date' => '2026-02-14',
        ], $overrides);
    }

    public function test_user_can_list_transactions(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $user->transactions()->create($this->transactionData());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/transactions');

        $response->assertOk()
            ->assertJsonCount(1);
    }

    public function test_user_can_create_transaction(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/transactions', $this->transactionData());

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Spesa supermercato']);
    }

    public function test_user_can_update_transaction(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $transaction = $user->transactions()->create($this->transactionData());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/transactions/{$transaction->id}", ['name' => 'Spesa aggiornata']);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Spesa aggiornata']);
    }

    public function test_user_can_delete_transaction(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $transaction = $user->transactions()->create($this->transactionData());

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }

    public function test_user_cannot_see_other_users_transactions(): void
    {
        [$user1,] = $this->authenticatedUser();
        $user1->transactions()->create($this->transactionData());

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->getJson('/api/transactions');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    public function test_create_transaction_validates_required_fields(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/transactions', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'amount', 'type', 'category', 'date']);
    }

    public function test_unauthenticated_user_cannot_access_transactions(): void
    {
        $response = $this->getJson('/api/transactions');

        $response->assertStatus(401);
    }
}

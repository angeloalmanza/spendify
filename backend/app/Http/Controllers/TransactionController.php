<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->latest()->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', 'in:income,expense'],
            'category' => ['required', 'string', 'max:100'],
            'date' => ['required', 'date'],
        ]);

        $transaction = $request->user()->transactions()->create($validated);

        return response()->json($transaction, 201);
    }

    public function update(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'type' => ['sometimes', 'in:income,expense'],
            'category' => ['sometimes', 'string', 'max:100'],
            'date' => ['sometimes', 'date'],
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    public function destroy(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();

        return response()->json(null, 204);
    }
}

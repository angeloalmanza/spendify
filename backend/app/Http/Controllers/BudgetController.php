<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $budgets = $request->user()->budgets()->get();
        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $budget = $request->user()->budgets()->updateOrCreate(
            ['category' => $validated['category']],
            ['amount' => $validated['amount']],
        );

        return response()->json($budget, 201);
    }

    public function destroy(Request $request, string $id)
    {
        $budget = $request->user()->budgets()->findOrFail($id);
        $budget->delete();

        return response()->json(null, 204);
    }
}

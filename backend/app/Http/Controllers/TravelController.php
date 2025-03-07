<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Travel;

class TravelController extends Controller
{
    /**
     * Obtener todas las consultas guardadas en la base de datos.
     */
    public function index()
    {
        $travels = Travel::all();
        return response()->json($travels);
    }

    /**
     * Guardar una nueva consulta de viaje en la base de datos.
     */
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'city' => 'required|string',
            'budget' => 'required|numeric|min:1',
            'converted_budget' => 'required|numeric',
            'exchange_rate' => 'required|numeric',
            'temperature' => 'required|numeric',
            'currency_name' => 'required|string',
            'currency_symbol' => 'required|string'
        ]);

        // Guardar en la base de datos
        $travel = Travel::create($validated);

        // Retornar la respuesta con los datos guardados
        return response()->json([
            'message' => 'Consulta guardada exitosamente',
            'data' => $travel
        ], 201);
    }

    /**
     * Mostrar una consulta específica por ID.
     */
    public function show($id)
    {
        $travel = Travel::find($id);

        if (!$travel) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        return response()->json($travel);
    }

    /**
     * Actualizar una consulta específica por ID.
     */
    public function update(Request $request, $id)
    {
        $travel = Travel::find($id);

        if (!$travel) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        $validated = $request->validate([
            'city' => 'sometimes|string',
            'budget' => 'sometimes|numeric|min:1',
            'converted_budget' => 'sometimes|numeric',
            'exchange_rate' => 'sometimes|numeric',
            'temperature' => 'sometimes|numeric',
            'currency_name' => 'sometimes|string',
            'currency_symbol' => 'sometimes|string'
        ]);

        $travel->update($validated);

        return response()->json([
            'message' => 'Registro actualizado exitosamente',
            'data' => $travel
        ]);
    }

    /**
     * Eliminar una consulta específica por ID.
     */
    public function destroy($id)
    {
        $travel = Travel::find($id);

        if (!$travel) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        $travel->delete();

        return response()->json(['message' => 'Registro eliminado correctamente']);
    }
}


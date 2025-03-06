<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Travel;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TravelController extends Controller
{
    /**
     * Obtener todas las consultas guardadas en la base de datos.
     */
    public function index()
    {
        $travels = Travel::all();
        return response()->json([
            'message' => 'Lista de consultas obtenida con éxito',
            'data' => $travels
        ], 200);
    }

    /**
     * Guardar una nueva consulta de viaje en la base de datos.
     */
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'city' => 'required|string|max:255',
            'budget' => 'required|numeric|min:1',
            'converted_budget' => 'required|numeric|min:0',
            'exchange_rate' => 'required|numeric|min:0',
            'temperature' => 'required|numeric',
            'currency_name' => 'required|string|max:50',
            'currency_symbol' => 'required|string|max:5'
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
        try {
            $travel = Travel::findOrFail($id);
            return response()->json([
                'message' => 'Registro encontrado',
                'data' => $travel
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    /**
     * Actualizar una consulta específica por ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $travel = Travel::findOrFail($id);

            $validated = $request->validate([
                'city' => 'sometimes|string|max:255',
                'budget' => 'sometimes|numeric|min:1',
                'converted_budget' => 'sometimes|numeric|min:0',
                'exchange_rate' => 'sometimes|numeric|min:0',
                'temperature' => 'sometimes|numeric',
                'currency_name' => 'sometimes|string|max:50',
                'currency_symbol' => 'sometimes|string|max:5'
            ]);

            $travel->update($validated);

            return response()->json([
                'message' => 'Registro actualizado exitosamente',
                'data' => $travel
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    /**
     * Eliminar una consulta específica por ID.
     */
    public function destroy($id)
    {
        try {
            $travel = Travel::findOrFail($id);
            $travel->delete();

            return response()->json(['message' => 'Registro eliminado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }
}


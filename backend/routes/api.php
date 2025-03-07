<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TravelController;

// 🔹 Asegurar que todas las respuestas sean JSON
header('Accept: application/json');
header('Content-Type: application/json');

// ✅ Definir rutas API con middleware 'api'
Route::middleware('api')->group(function () {
    Route::get('/travels', [TravelController::class, 'index']);  // Obtener todas las consultas
    Route::post('/travels', [TravelController::class, 'store']); // Guardar una nueva consulta
    Route::get('/travels/{id}', [TravelController::class, 'show']); // Obtener una consulta por ID
    Route::put('/travels/{id}', [TravelController::class, 'update']); // Actualizar una consulta
    Route::delete('/travels/{id}', [TravelController::class, 'destroy']); // Eliminar una consulta
});







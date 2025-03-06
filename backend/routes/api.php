<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TravelController;

// Definir las rutas sin necesidad de 'middleware(api)'
Route::get('/travels', [TravelController::class, 'index']);  // Obtener todas las consultas
Route::post('/travels', [TravelController::class, 'store']); // Guardar una nueva consulta
Route::get('/travels/{id}', [TravelController::class, 'show']); // Obtener una consulta por ID
Route::put('/travels/{id}', [TravelController::class, 'update']); // Actualizar una consulta
Route::delete('/travels/{id}', [TravelController::class, 'destroy']); // Eliminar una consulta





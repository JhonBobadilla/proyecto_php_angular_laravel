<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('travels', function (Blueprint $table) {
            $table->id();
            $table->string('city'); // Ciudad de destino
            $table->decimal('budget', 10, 2); // Presupuesto en COP
            $table->decimal('converted_budget', 10, 2)->nullable(); // Presupuesto en la moneda local
            $table->decimal('exchange_rate', 10, 5)->nullable(); // Tasa de cambio aplicada
            $table->decimal('temperature', 5, 2)->nullable(); // Clima en °C
            $table->string('currency_name')->nullable(); // Nombre de la moneda
            $table->string('currency_symbol')->nullable(); // Símbolo de la moneda
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travels');
    }
};


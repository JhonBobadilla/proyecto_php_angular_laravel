<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Travel extends Model
{
    use HasFactory;

    protected $table = 'travels'; // Especificamos el nombre de la tabla
    protected $fillable = [
        'city',
        'budget',
        'converted_budget',
        'exchange_rate',
        'temperature',
        'currency_name',
        'currency_symbol'
    ];
}


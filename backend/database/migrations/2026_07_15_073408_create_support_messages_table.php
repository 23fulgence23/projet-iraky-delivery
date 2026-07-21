<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_messages', function (Blueprint $table) {
            $table->id();

            // Le client concerné par la conversation (toujours renseigné,
            // que le message vienne du client ou d'un admin qui lui répond)
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');

            // Qui a écrit le message
            $table->enum('sender_role', ['client', 'admin']);
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null');

            $table->text('texte');
            $table->boolean('lu')->default(false); // lu côté admin (pour le badge non-lus)

            $table->timestamps();

            $table->index(['client_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_messages');
    }
};
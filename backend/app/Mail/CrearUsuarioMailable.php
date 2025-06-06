<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CrearUsuarioMailable extends Mailable
{
    use Queueable, SerializesModels;
    public $nombre;
    public $celular;
    public $ocupacion;
    public $correo;
    public $password;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($nombre, $celular, $ocupacion, $correo, $password)
    {
        $this->nombre = $nombre;
        $this->celular = $celular;
        $this->ocupacion = $ocupacion;
        $this->correo = $correo;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            from: new Address('info@clubtoros.com', 'Club Toros'),
            subject: 'Bienvenido al admin del Club Toros',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.usuario',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}

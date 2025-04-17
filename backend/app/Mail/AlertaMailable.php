<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AlertaMailable extends Mailable
{
    use Queueable, SerializesModels;
    public $asunto;
    public $mensaje;
    public $nombre_tutor;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($asunto, $mensaje, $nombre_tutor)
    {
        $this->asunto = $asunto;
        $this->mensaje = $mensaje;
        $this->nombre_tutor = $nombre_tutor;
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
            subject: $this->asunto,
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
            view: 'emails.alerta',
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

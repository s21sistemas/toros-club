<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pre-Registro Completado</title>

    <style>
        .button-login {
            background-color: #f7be13;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            font-size: 16px;
            transition: .3s background;
        }

        .button-login:hover {
            background-color: #ebb61a;
        }

        .info-a {
            transition: .3s opacity;
        }

        .info-a:hover{
            opacity: 0.8;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto; background-color: #ffffff; border-radius: 8px 8px 0 0;">
                    <tr>
                        <td style="padding: 25px; text-align: center; background-color: #FBBE08; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Pre-registro exitoso!</h1>
                        </td>
                    </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto; background-color: #ffffff;">
                    <tr>
                        <td style="padding: 30px 25px;">
                            <h2 style="color: #ebb61a; margin-top: 0; margin-bottom: 20px;">Bienvenido(a)</h2>
                            <p style="line-height: 1.6; margin-bottom: 25px; font-size: 16px;">Gracias por completar su pre-registro. Hemos guardado sus datos correctamente y estamos emocionados de tenerle con nosotros. A continuación, encontrará un resumen de la información proporcionada:</p>

                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 0 0 25px 0; border: 1px solid #eeeeee; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 10px 5px; border-bottom: 1px solid #eeeeee;">
                                                    <strong style="color: #dbaa17; width: 150px; display: inline-block;">Nombre completo:</strong>
                                                    <span style="color: #333333;">{{$data['nombre_completo']}}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 5px; border-bottom: 1px solid #eeeeee;">
                                                    <strong style="color: #dbaa17; width: 150px; display: inline-block;">Celular:</strong>
                                                    <span style="color: #333333;">{{$data['celular']}}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 5px; border-bottom: 1px solid #eeeeee;">
                                                    <strong style="color: #dbaa17; width: 150px; display: inline-block;">Ocupación:</strong>
                                                    <span style="color: #333333;">{{$data['ocupacion']}}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 5px; border-bottom: 1px solid #eeeeee;">
                                                    <strong style="color: #dbaa17; width: 150px; display: inline-block;">Correo:</strong>
                                                    <span style="color: #333333;">{{$data['correo']}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 0 0 25px 0; background-color: #f9f9f9; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <h3 style="color: #ebb61a; margin-top: 0; margin-bottom: 15px;">Su contraseña</h3>
                                        <p style="font-size: 14px; margin-bottom: 15px;">Hemos generado una contraseña automáticamente para su cuenta:</p>
                                        <div style="background-color: #ffffff; border: 2px dashed #FBBE08; padding: 15px; font-size: 20px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
                                            {{$data['contrasena']}}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="https://sistema.clubtoros.com/login" class="button-login" style="color: #ffffff">Iniciar sesión</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="line-height: 1.6; margin-bottom: 20px;">Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos. Estamos aquí para ayudarle.</p>

                            <p style="line-height: 1.6; margin-bottom: 10px;">Saludos cordiales,</p>
                            <p style="line-height: 1.6; font-weight: bold; margin: 0 0 15px 0; color: #ebb61a;">Equipo de soporte</p>
                        </td>
                    </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto; background-color: #333333; border-radius: 0 0 8px 8px;">
                    <tr>
                        <td style="padding: 20px; text-align: center; color: #ffffff;">
                            <p style="margin: 0 0 10px 0; font-size: 14px;">© 2025 Todos los derechos reservados.</p>
                            <p style="margin: 10px 0 0 0; font-size: 12px;">Si tiene alguna duda, contáctenos a: <a href="mailto:info@clubtoros.com" class="info-a" style="color: #ffffff">info@clubtoros.com</a></p>
                            <p style="margin: 5px 0 0 0; font-size: 12px;">Teléfono: <a href="tel:8123083216" class="info-a" style="color: #ffffff">81 2308 3216</a></p>
                        </td>
                    </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto;">
                    <tr>
                        <td style="height: 20px;"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

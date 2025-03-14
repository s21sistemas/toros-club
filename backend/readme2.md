# 📌 Toros Club - Backend API

Este es el backend en Laravel para el sistema de gestión de "Toros Club".
A continuación, se detallan los endpoints disponibles.

## 🌐 Base URL

```
https://sistema.clubtoros.com/
```

## 🔑 Autenticación

Algunas rutas requieren autenticación mediante un token Bearer en los headers.

### **Endpoints de Autenticación**

```
POST /login
POST /registro
POST /logout
```

#### 📥 **Login**

```json
{
    "correo": "email requerido",
    "contrasena": "string requerida"
}
```

-   Si las credenciales son incorrectas, devuelve un error `401`.

#### 📥 **Registro**

```json
{
    "nombre_completo": "string requerido, max: 255",
    "celular": "string requerido, max: 15",
    "ocupacion": "string requerido, max: 100",
    "correo": "email requerido, único"
}
```

#### 📤 **Logout**

-   No requiere datos en la solicitud.

---

## 📌 **Roles** (Solo admin)

```
GET /roles
POST /roles
GET /roles/{id}
PUT /roles/{id}
DELETE /roles/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "nombre": "string requerido, único, max: 100",
    "permisos": "string requerido"
}
```

**Requiere en PUT:**

```json
{
    "nombre": "string opcional, único, max: 100",
    "permisos": "string opcional"
}
```

---

## 👥 **Usuarios**

```
GET /usuarios
POST /usuarios
GET /usuarios/{id}
PUT /usuarios/{id}
DELETE /usuarios/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "nombre_completo": "string opcional, max: 255",
    "celular": "string opcional, max: 15",
    "ocupacion": "string opcional, max: 100",
    "correo": "email opcional, único",
    "contrasena": "string opcional, min: 6",
    "rol_id": "integer opcional, debe existir en roles"
}
```

**Requiere en PUT:**

```json
{
    "nombre_completo": "string opcional, max: 255",
    "celular": "string opcional, max: 15",
    "ocupacion": "string opcional, max: 100",
    "correo": "email opcional, único",
    "contrasena": "string opcional, min: 6",
    "rol_id": "integer opcional, debe existir en roles"
}
```

---

## 👤 **Perfil**

```
GET /perfil
PUT /perfil/{id}
```

**Requiere en PUT:**

```json
{
    "nombre_completo": "string opcional, max: 255",
    "celular": "string opcional, max: 15",
    "ocupacion": "string opcional, max: 100",
    "correo": "email opcional, único",
    "contrasena": "string opcional, min: 6"
}
```

---

## 📝 **Documentos del jugador**

```
GET /documentos
POST /documentos
GET /documentos/{id}
POST /documentos/{id}
DELETE /documentos/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "registro_jugador_id": "integer requerido, único",
    "curp_jugador": "archivo PDF requerido, max: 2048 KB",
    "ine_tutor": "archivo PDF requerido, max: 2048 KB",
    "acta_nacimiento": "archivo PDF requerido, max: 2048 KB",
    "comprobante_domicilio": "archivo PDF requerido, max: 2048 KB"
}
```

**Requiere en PUT:**

🔹 **IMPORTANTE:** Para actualizar documentos, envía la petición en `POST` usando `form-data` y agrega el campo `_method` con valor `PUT`.

```json
{
    "curp_jugador": "archivo PDF opcional, max: 2048 KB",
    "ine_tutor": "archivo PDF opcional, max: 2048 KB",
    "acta_nacimiento": "archivo PDF opcional, max: 2048 KB",
    "comprobante_domicilio": "archivo PDF opcional, max: 2048 KB"
}
```

---

## 🔄 **Transferencias de jugadores**

```
GET /transferencia-jugadores
POST /transferencia-jugadores
GET /transferencia-jugadores/{id}
PUT /transferencia-jugadores/{id}
DELETE /transferencia-jugadores/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "club_anterior": "string requerido",
    "temporadas_jugadas": "integer requerido, min: 1",
    "motivo_transferencia": "string requerido",
    "registro_jugador_id": "integer requerido, único"
}
```

**Requiere en PUT:**

```json
{
    "club_anterior": "string opcional",
    "temporadas_jugadas": "integer opcional, min: 1",
    "motivo_transferencia": "string opcional"
}
```

---

## 💳 **Pagos NTR**

```
GET /pagos-ntr
POST /pagos-ntr
GET /pagos-ntr/{id}
PUT /pagos-ntr/{id}
DELETE /pagos-ntr/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "inscripcion": "boolean requerido",
    "tunel": "boolean requerido",
    "botiquin": "boolean requerido",
    "coacheo_semanal": "boolean requerido",
    "registro_jugador_id": "integer requerido, único"
}
```

**Requiere en PUT:**

```json
{
    "inscripcion": "boolean opcional",
    "tunel": "boolean opcional",
    "botiquin": "boolean opcional",
    "coacheo_semanal": "boolean opcional"
}
```

---

📌 **Nota:**

-   Todos los endpoints dentro de `Route::middleware('auth:sanctum')` requieren un token Bearer en los headers.
-   Si un usuario no tiene permisos o su token es inválido, se devuelve un error `422` con el mensaje `Unauthenticated`.
-   Solo los administradores pueden eliminar registros en cualquier endpoint.

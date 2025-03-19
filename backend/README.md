# Toros Club - Backend API

Bienvenido al backend de Toros Club, un sistema desarrollado en Laravel para gestionar el registro de jugadores, documentos, pagos, transferencias, etc., dentro del club. Este API proporciona un entorno seguro y eficiente para la administración de usuarios, roles y la información clave del sistema, entre otras.
Este documento detalla los endpoints disponibles, los datos requeridos en cada petición y las reglas de validación aplicadas.

## URL base

```
https://sistema.clubtoros.com/api
```

## Autenticación

La API está protegida mediante Laravel Sanctum, por lo que para acceder a los endpoints protegidos es necesario incluir un token Bearer en las peticiones.
Cada solicitud debe cumplir con las validaciones establecidas, y en caso de errores en los datos, se devolverá una respuesta con código 422 indicando el problema específico.

### **Login**

**Endpoint:**

```
POST /login
```

**Requiere:**

```json
{
    "correo": "email requerido",
    "contrasena": "string requerido"
}
```

**Errores:**

-   `401`: Credenciales incorrectas.
-   `422`: Datos inválidos o faltantes.

---

### **Pre Registro**

**Endpoint:**

```
POST /registro
```

**Requiere:**

```json
{
    "nombre_completo": "string requerido, max: 255",
    "celular": "string requerido, max: 15",
    "ocupacion": "string requerido, max: 100",
    "correo": "email requerido, único"
}
```

**Errores:**

-   `422`: Datos inválidos o faltantes.

---

### **Logout**

**Endpoint:**

```
POST /logout
```

**Requiere:**

-   Token de autenticación en el header como `Bearer token`

---

## **Rutas protegidas** (Requieren autenticación con `Bearer token`)

### **Roles** (Solo para administradores)

```
GET /roles
POST /roles
GET /roles/{id}
PUT /roles/{id}
DELETE /roles/{id}
```

**Requiere en POST:**

```json
{
    "nombre": "string requerido, max: 100, único",
    "permisos": "string requerido"
}
```

**Requiere en PUT:**

```json
{
    "nombre": "string opcional, max: 100, único",
    "permisos": "string opcional"
}
```

---

### **Usuarios**

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
    "nombre_completo": "string requerido, max: 255",
    "celular": "string requerido, max: 15",
    "ocupacion": "string requerido, max: 100",
    "correo": "email requerido, único",
    "contrasena": "string requerido, min: 6",
    "rol_id": "integer requerido, debe existir en roles"
}
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

### **Perfil**

```
GET /perfil
PUT /perfil
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

### **Registro de Jugadores**

```
GET /registro-jugadores
POST /registro-jugadores
GET /registro-jugadores/{id}
PUT /registro-jugadores/{id}
DELETE /registro-jugadores/{id} (Solo admin)
```

**SI 'tipo_inscripcion' ES IGUAL A 'transferencia' requiere en POST:**

```json
{
    "nombre": "string requerido, max: 20",
    "apellido_p": "string requerido, max: 30",
    "apellido_m": "string requerido, max: 30",
    "sexo": "requerido, valores: hombre, mujer",
    "direccion": "string requerido, max: 500",
    "telefono": "string requerido, max: 15",
    "fecha_nacimiento": "date requerido",
    "lugar_nacimiento": "string requerido, max: 255",
    "curp": "string requerido, tamaño: 18, único",
    "grado_escolar": "requerido, valores: primaria, secundaria, preparatoria",
    "nombre_escuela": "string requerido, max: 255",
    "alergias": "string requerido, max: 500",
    "padecimientos": "string requerido, max: 500",
    "peso": "numeric requerido, min: 1, max: 500",
    "tipo_inscripcion": "requerido, valores: novato, reinscripcion, transferencia, porrista",
    "foto_jugador": "base64 requerido",

    "club_anterior": "string requerido",
    "temporadas_jugadas": "integer requerido, min: 1",
    "motivo_transferencia": "string requerido"
}
```

**Requiere en POST:**

```json
{
    "nombre": "string requerido, max: 20",
    "apellido_p": "string requerido, max: 30",
    "apellido_m": "string requerido, max: 30",
    "sexo": "requerido, valores: hombre, mujer",
    "direccion": "string requerido, max: 500",
    "telefono": "string requerido, max: 15",
    "fecha_nacimiento": "date requerido",
    "lugar_nacimiento": "string requerido, max: 255",
    "curp": "string requerido, tamaño: 18, único",
    "grado_escolar": "requerido, valores: primaria, secundaria, preparatoria",
    "nombre_escuela": "string requerido, max: 255",
    "alergias": "string requerido, max: 500",
    "padecimientos": "string requerido, max: 500",
    "peso": "numeric requerido, min: 1, max: 500",
    "tipo_inscripcion": "requerido, valores: novato, reinscripcion, transferencia, porrista",
    "foto_jugador": "base64 requerido"
    // "foto_jugador": "imagen requerido, formatos: jpg, jpeg, png, max: 2048 KB"
}
```

**Requiere en PUT:**

<!-- **IMPORTANTE:** Para actualizar la foto, envía la petición en `POST` usando `form-data` y agrega el campo `_method` con valor `PUT`. -->

```json
{
    "nombre": "string opcional, max: 20",
    "apellido_p": "string opcional, max: 30",
    "apellido_m": "string opcional, max: 30",
    "sexo": "opcional, valores: hombre, mujer",
    "direccion": "string opcional, max: 500",
    "telefono": "string opcional, max: 15",
    "fecha_nacimiento": "date opcional",
    "lugar_nacimiento": "string opcional, max: 255",
    "curp": "string opcional, tamaño: 18, único",
    "grado_escolar": "opcional, valores: primaria, secundaria, preparatoria",
    "nombre_escuela": "string opcional, max: 255",
    "alergias": "string opcional, max: 500",
    "padecimientos": "string opcional, max: 500",
    "peso": "numeric opcional, min: 1, max: 500",
    "tipo_inscripcion": "opcional, valores: novato, reinscripcion, transferencia, porrista",
    "foto_jugador": "base64 opcional"
    // "foto_jugador": "imagen opcional, formatos: jpg, jpeg, png, max: 2048 KB"
}
```

---

### **Actualizar Número MFL de Jugadores**

```
PATCH /actualizar-mfl/{id}
```

**Requiere en PATCH:**

```json
{
    "numero_mfl": "string requerido, min: 7, max: 8"
}
```

---

### **Busqueda a Jugadores por CURP**

```
GET /search-jugadores?curp={curp}
```

---

### **Registro de Porristas**

```
GET /registro-porristas
POST /registro-porristas
GET /registro-porristas/{id}
PUT /registro-porristas/{id}
DELETE /registro-porristas/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "nombre": "string requerido, max: 20",
    "apellido_p": "string requerido, max: 30",
    "apellido_m": "string requerido, max: 30",
    "sexo": "requerido, valores: hombre, mujer",
    "direccion": "string requerido, max: 500",
    "telefono": "string requerido, max: 15",
    "fecha_nacimiento": "date requerido",
    "lugar_nacimiento": "string requerido, max: 255",
    "curp": "string requerido, tamaño: 18, único",
    "grado_escolar": "requerido, valores: primaria, secundaria, preparatoria",
    "nombre_escuela": "string requerido, max: 255",
    "alergias": "string requerido, max: 500",
    "padecimientos": "string requerido, max: 500",
    "peso": "numeric requerido, min: 1, max: 500",
    "tipo_inscripcion": "requerido, valores: novato, reinscripcion, transferencia, porrista",
    "foto_porrista": "base64 requerido"
    // "foto_porrista": "imagen requerido, formatos: jpg, jpeg, png, max: 2048 KB"
}
```

**Requiere en PUT:**

<!-- **IMPORTANTE:** Para actualizar la foto, envía la petición en `POST` usando `form-data` y agrega el campo `_method` con valor `PUT`. -->

```json
{
    "nombre": "string opcional, max: 20",
    "apellido_p": "string opcional, max: 30",
    "apellido_m": "string opcional, max: 30",
    "sexo": "opcional, valores: hombre, mujer",
    "direccion": "string opcional, max: 500",
    "telefono": "string opcional, max: 15",
    "fecha_nacimiento": "date opcional",
    "lugar_nacimiento": "string opcional, max: 255",
    "curp": "string opcional, tamaño: 18, único",
    "grado_escolar": "opcional, valores: primaria, secundaria, preparatoria",
    "nombre_escuela": "string opcional, max: 255",
    "alergias": "string opcional, max: 500",
    "padecimientos": "string opcional, max: 500",
    "peso": "numeric opcional, min: 1, max: 500",
    "tipo_inscripcion": "opcional, valores: novato, reinscripcion, transferencia, porrista",
    "foto_porrista": "base64 opcional"
    // "foto_porrista": "imagen opcional, formatos: jpg, jpeg, png, max: 2048 KB"
}
```

---

### **Documentos del jugador**

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

**IMPORTANTE:** Para actualizar documentos, envía la petición en `POST` usando `form-data` y agrega el campo `_method` con valor `PUT`.

```json
{
    "curp_jugador": "archivo PDF opcional, max: 2048 KB",
    "ine_tutor": "archivo PDF opcional, max: 2048 KB",
    "acta_nacimiento": "archivo PDF opcional, max: 2048 KB",
    "comprobante_domicilio": "archivo PDF opcional, max: 2048 KB"
}
```

---

### **Transferencia de jugadores**

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

### **Pagos NTR (jugadores)**

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
    "coacheo_semanal": "boolean opcional",
    "registro_jugador_id": "integer opcional, único"
}
```

---

### **Pagos Porristas**

```
GET /pagos-porristas
POST /pagos-porristas
GET /pagos-porristas/{id}
PUT /pagos-porristas/{id}
DELETE /pagos-porristas/{id} (Solo admin)
```

**Requiere en POST:**

```json
{
    "inscripcion": "boolean requerido",
    "coacheo_semanal": "boolean requerido",
    "registro_porrista_id": "integer requerido, único"
}
```

**Requiere en PUT:**

```json
{
    "inscripcion": "boolean opcional",
    "coacheo_semanal": "boolean opcional",
    "registro_porrista_id": "integer opcional, único"
}
```

---

### **Notas**

-   Todos los endpoints dentro de `Route::middleware('auth:sanctum')` requieren un token en el header `Authorization: Bearer {token}`.
-   Los administradores son los únicos que pueden eliminar registros en todas las entidades.
-   En `documentos`, `transferencia-jugadores` y `pagos-ntr`, el `registro_jugador_id` es único.
-   Para actualizar documentos e imágenes en Laravel con PUT, se debe enviar `_method=PUT` en un request POST.

---

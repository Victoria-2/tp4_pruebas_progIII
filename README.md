# Documentación

### El archivo README.md debe incluir lo siguiente:

- Número de grupo e integrantes.
- Nombre del proyecto y su descripción.
- Metodología de trabajo con Git y GitHub.
- División de los archivos entre los integrantes.
- Distribución de los archivos y carpetas.
- Un 90% de las funciones explicadas a detalle.
- Documentación con ‘Postman’ de todos los métodos (GET, PUT, DELETE, POST).
- Mínimo un ejemplo de la estructura de cada archivo JSON utilizado (no integrar varios “arrays” en un mismo archivo).
- Link del deploy en Render.
- Link al repositorio con el front-end.

---

# Apartado JWT

## Que Hay Que Completar: Autenticacion JWT

El sistema de autenticacion esta parcialmente implementado. Hay **8 TODOs** distribuidos en 3 archivos que deben ser completados para que funcione.

### Como funciona JWT (teoria)

1. El usuario se **registra** enviando nombre, email y password.
2. El servidor **hashea** la password (nunca se guarda en texto plano) y crea el usuario en la BD.
3. El servidor genera un **token JWT** (un string firmado que contiene el id y email del usuario) y se lo devuelve.
4. Para las siguientes peticiones, el cliente envia el token en el header `Authorization: Bearer <token>`.
5. El servidor **verifica** que el token sea valido y no haya expirado antes de dar acceso.

### Endpoints de la API

| Metodo | Ruta                 | Protegida | Descripcion                        |
| ------ | -------------------- | --------- | ---------------------------------- |
| `POST` | `/api/auth/register` | No        | Registrar un nuevo usuario         |
| `POST` | `/api/auth/login`    | No        | Iniciar sesion                     |
| `GET`  | `/api/auth/perfil`   | Si        | Obtener datos del usuario logueado |

#### Ejemplo: Registro

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "email": "juan@test.com", "password": "123456"}'
```

Respuesta esperada (una vez completados los TODOs):

```json
{
  "message": "Usuario registrado exitosamente",
  "user": { "id": 1, "nombre": "Juan", "email": "juan@test.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Ejemplo: Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@test.com", "password": "123456"}'
```

#### Ejemplo: Acceder al perfil (ruta protegida)

```bash
curl http://localhost:3001/api/auth/perfil \
  -H "Authorization: Bearer <token_obtenido_en_login>"
```

### Archivos con TODOs

A continuacion se detalla cada TODO. **No cambies la estructura de los archivos**, solo completa las partes indicadas.

---

### 1. `backend/models/User.js` — Modelo de usuario

Este archivo define la tabla `users` en la base de datos usando Sequelize.

**TODO 1 — Hook `beforeCreate`:** Antes de guardar un usuario nuevo, hay que hashear la password para no almacenarla en texto plano.

```javascript
// Pista: bcrypt.hash(user.password, 10) devuelve una promesa con el hash.
// Hay que asignar el resultado a user.password.
```

**TODO 2 — Metodo `validarPassword`:** Este metodo compara una password en texto plano con el hash almacenado. Se usa en el login.

```javascript
// Pista: bcrypt.compare(password, this.password) devuelve true o false.
```

---

### 2. `backend/middleware/auth.js` — Generacion y verificacion de tokens

Este archivo exporta dos funciones: una para crear tokens y otra para verificar que un request tenga un token valido.

**TODO 3 — `generarToken`:** Crear un JWT firmado con los datos del usuario.

```javascript
// Pista: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })
```

**TODO 4 — Extraer el token del header:** El header `Authorization` tiene el formato `"Bearer eyJhbG..."`. Hay que extraer solo la parte del token.

```javascript
// Pista: authHeader.split(' ') devuelve un array ["Bearer", "eyJhbG..."].
// El token esta en la posicion [1].
```

**TODO 5 — `verificarToken`:** Decodificar el token y, si es valido, guardar los datos del usuario en `req.user` para que los controladores puedan usarlos.

```javascript
// Pista: jwt.verify(token, JWT_SECRET) devuelve el payload decodificado.
// Guardar el resultado en req.user y llamar a next().
```

---

### 3. `backend/controllers/authController.js` — Logica de registro, login y perfil

Este archivo tiene la logica de negocio de cada endpoint.

**TODO 6 — `register`:** Crear el usuario en la base de datos.

```javascript
// Pista: await User.create({ nombre, email, password })
// El hook beforeCreate se encarga de hashear la password automaticamente.
```

**TODO 7 — `login`:** Buscar al usuario por email y validar su password.

```javascript
// Pista para buscar: await User.findOne({ where: { email } })
// Pista para validar: await user.validarPassword(password)
```

**TODO 8 — `perfil`:** Obtener el usuario desde la BD usando el id que el middleware puso en `req.user`.

```javascript
// Pista: await User.findByPk(req.user.id)
```

---

### Como verificar que funciona

Una vez completados los 8 TODOs:

```bash
# 1. Levantar los servicios
docker-compose up

# 2. Registrar un usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Test", "email": "test@test.com", "password": "123456"}'

# 3. Hacer login (copiar el token de la respuesta)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'

# 4. Acceder al perfil con el token
curl http://localhost:3001/api/auth/perfil \
  -H "Authorization: Bearer PEGAR_TOKEN_AQUI"
```

Si el paso 4 devuelve los datos del usuario, la autenticacion esta funcionando correctamente.

---

## Desarrollo con Hot Reload

Cuando los servicios estan corriendo, los cambios en el codigo se aplican automaticamente:

- **Frontend (React):** Cualquier cambio en `frontend/src/` se refleja al instante en el navegador gracias a Fast Refresh.
- **Backend (Express):** Cualquier cambio en `backend/` reinicia automaticamente el servidor gracias a nodemon.
- **Base de datos:** Los datos persisten entre reinicios gracias a los volumenes de Docker. Solo se pierden si ejecutas `docker-compose down -v`.

### Flujo de trabajo

1. Edita los archivos en tu editor (VS Code, etc.)
2. Los cambios se detectan automaticamente dentro del contenedor
3. El servicio correspondiente se recarga
4. Verifica en el navegador o con `curl`

---

# BACKEND PARA LA CLÍNICA ESTÉTICA: COSMETOLÓGA VALERY MIRANDA
*Realizado por Noelia Camelia*

<ins>Se centra en la realización del backend necesario para la reserva de citas en la clínica</ins>
<ins>Realizado con Node.js y Express.js</ins>

## Para inicializar el proyecto en formato desarrollador:
    - Utilice, en consola, el comando: npm run dev

## Para inicializar la base de datos: 
    - Duplicar el archivo .env.example y cambiar el nombre a .env 
    - Definir todas las variables de entornos declaradas en .env
    - Utilice, en consola, el comando: npm run initDB

## Tablas de la base de datos: 

### Pacientes
```
- id
- Nombre
- Apellido
- email
- teléfono
- fecha de creación
- fecha de modificación
```

### Tratamientos
```
- id
- nombre del tratamiento
- descripción
- tiempo utilizado para la realización
- precio
```

### Citas
```
- id
- id del paciente
- id del tratamiento
- hora de inicio de la cita
- hora de fin de la cita
- estado (El mismo solo puede ser: Pendiente, Confirmado, Cancelado)
```

### Administradores 
*(se necesita una ruta diferente a la de los usuarios y requiere autenticación)*
```
- id
- Nombre
- Apellido
- email
- celphone
- contraseña 
- fecha de creación
- fecha de modificación
```

## Endpoints
- "/": Página principal, donde se podrá ver cada uno de los tratamientos implantados en la clínica
- "/contact": Datos de contacto y ubicación de la/las sucursales de la clínica
- "/appointments": Fechas y horarios disponibles para las reservas
- "/admin": Para modificación de los horarios disponibles, acceso mediante autenticación, únicamente para administradores
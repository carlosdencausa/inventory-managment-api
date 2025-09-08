# Interacciones & Prompts con la AI

Estos son unos prompts que utilicé durante del desarrollo de esta solución.
En casi todos los casos busco siempre darle un **ROL** asignado a la AI y entregarle el mayor contexto posible para que entienda cómo debe comportarse y qué se espera de su repuesta.
Por último, también avancé con otras cosas como la creación del middleware y de la cola para la concurrencia pero eso fue más en interacciones constantes más que una instrucción única para que el resultado fuera más robusto y funcionara de manera correcta.


## Algunos prompts utilizados:

### Creando el proyecto
```
Eres un ingeniero en sistemas especializado en javascript y que utiliza el framework de NestJS.
La version de node que utilizaras es v18.20.4 y la version de NestJs 10.1.18
1- crear un boilderplate de una rest-api con arquitectura exagonal.
2- crea un archivo de docker para poder levantar el proyecto
3- Crea un endpoint de hola-mundo
4- implementar swager que genere automaticamente la documentación de la API
```

### Creando Save en repositorio
```
Debo generar un metodo que cumple la misma función que un .save() de mysql pero en su lugar debo guardar los registros de productos nuevos en products.json.
Se deben aplicar validaciones standard como que el ean debe ser EAN debe ser único
```

### Creando Update
```
Eres un ingeniero en sistemas especializado en javascript y que utiliza el framework de NestJS.
La version de node que utilizaras es v18.20.4 y la version de NestJs 10.1.18 y necesito que crees los siguientes metodos:
1- crea en products/domain/dtos/product.dtos un dto de product que sea partial para ser utilizado en los casos de update
2- crea en products/domain/interfaces/product.repository.interfaces una interface para el metodo update que reciba como parametro el dto creado antes y retorne un ProductDto
2- crea en products/infraestructure/product.repository un metodo update basandote en la interface creada en el paso anterior para actualizar productos. Este metodo va a recibir un id y puede que una o varias propeidades de product
```

```
Eres un ingeniero en sistemas especializado en javascript y que utiliza el framework de NestJS.
La version de node que utilizaras es v18.20.4 y la version de NestJs 10.1.18 y necesito que crees los siguientes metodos:
1- crea en products/domain/interfaces una nueva interface para el usecase de update el cual reciba un id y un UpdateProductDto para retornar un productDto.
2- crea en products/application/usecases el usecase para update implementando la interface creada en el paso 1 y que inyecte la interface de product.repository.interface para usar el metodo update
3- crea en products/infraestructure/controllers/product.controller un nuevo endpoint para update y que este inyecte la interface creada en el punto 1 y la utilice para pasar los datos. Recibirá un id en el patch y un bodi del tipo UpdateProductDto
```

### Implementando Lots
```
Eres un ingeniero en sistemas especializado en javascript y que utiliza el framework de NestJS.
La version de node que utilizaras es v18.20.4 y la version de NestJs 10.1.18 y necesito que crees los siguientes metodos y recuerda que no debes usar letras como definición de variables o constantes si no que siempre usa nombres representativos:
* Quiero que copies las implementaciones de products pero orientadas al objeto de lots el cual ya existe en la carpeta lots.
* agrega documentacion en ingles
* agrega swagger
* agrega pruebas unitarias
```

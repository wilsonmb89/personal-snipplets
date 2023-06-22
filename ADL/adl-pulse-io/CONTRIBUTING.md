# Contrinuyendo con pulse.io

Siempre estamos dispuestos a recibir todas sus contribuciones para hacer de `pulse.io`mucho mejor para todos!!!

- [Codigo de Conducta](#coc)
- [Solicitud Nuevas Caracteristicas](#snc)
- [Reportar Issues & Bugs](#i&b)
- [Aportando Codigo / Pull Request](apr)
- [Reglas de Codificacion](#rdc)
- [Guia de Commit Message](#gcm)
- [Firmando el CLA](#cla)

## <a name="coc"></a> Codigo de Conducta

  Para __PULSE.IO__ es de vital importancia que todos sus colaboradores cumplan a cabalidad el codigo [ver aquí](https://github.com/ivanntis/pulse/blob/master/CODIGO_CONDUCTA.md).

## <a name="snc"></a> Solicitud Nuevas Caracteristicas

## <a name="i&b"></a> Reportar Issues & Bugs

## <a name="apr"></a> Aportando Codigo / Pull Request
  
## <a name="rdc"></a> Reglas de Codificacion

### Guia de estilo __PULSE.IO__

#### Estructura de archivos:

- Un componente por archivo.
- Un componente por Directorio. El directorio debe tener el nombre explicito de lo que hace el componente.

> components
>
> > pulse-mol
> > > pulse-card-group
> > > > pulse-card-group.tsx
> > > >
> > > > pulse-card-group.scss
> > > >
> > > > pulse-card-group.scss
>
> > pulse-atm
> > > button
> > > > pulse-button.tsx
> > > >
> > > > pulse-button.scss
> > > >
> > > > pulse-button.vars.scss
> 
> > pulse-template
> > > flowtt
> > > > pulse-flowtt.tsx
> > > >
> > > > pulse-flowtt.scss

#### Nombramiento de componentes

##### html tag

**Prefijo** Todos los componentes van a inciar con _pulse-_
**Nombre** Los nombres deben ser claro y dene indicar conceptualmente un objeto, no debe utilzar verbor. 

##### TS

Utilizamos el estandar ES6, No debe tener prefijos y comiensan con la palabra Pulse.

*Ejemplo:*

```ts
@Component({
  tag: 'pulse-button'
})
export class PulseButton { ... }

```

 **css/sass** -> El estandar seleccionado para la creacion de estilos y nombramiento de clases es [BEM](http://getbem.com/)

 **ts** -> El lenguaje base es Typescript, por lo cual se valida con [TSLint](https://palantir.github.io/tslint/)

## <a name="gcm">Guia de Commit Message</a>

Convención simple para dar formato a los mensages que se agregan cada vez que se realiza un commit, el cual nos permite crear reglas sencillas que nos permiten tener organizado el historico del proyecto, adicionalmente con este estandar podemos automatizar la generacion de versiones "__PULSE.IO__ utiliza [SemVer](https://semver.org/)".

La guia completa que utiliza __PULSE.IO__ como estandar para los mensages es [Convetional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.4)

Para __PULSE.IO__ se puede validar la estructura permitida en el archivo [versionrc](https://github.com/ivanntis/pulse/blob/master/.versionrc)

### Esturctura base

> \<type>[(optional scope)]: \<description>
>
> [optional body]
>
> [optional footer]

### Ejemplo

> **NUEVAS CARACTERISTICAS:** git commit -am "feat(button): se crea los botones solidos"
>
> **ERRORES:** git commit -am "fix(button): se corrige la sombra del hover"
>
> **DOCUMENTACION:** git commit -am "doc: Se modifica el codigo de conducta"


## <a name="cla"></a> Firmando el CLA



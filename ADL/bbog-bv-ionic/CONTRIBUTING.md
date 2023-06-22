# Contributing with Banca virtual BDB

**Index**
1. [Environments](#id1)
1. [Branch naming](#id2)
2. [Code Rules](#id3)
3. [Project Rules](#id4)

____________

## Environments<a name="id1"></a>

- __qa__: (https://d25qz71d802ha8.cloudfront.net/#/login)
- __st__: (https://virtual-staging.bancodebogota.co/#/login)
- __bt1__: (https://d3r4sf9u4glw4z.cloudfront.net/#/login)
- __bt2__: (https://d1gknwtywdi1zt.cloudfront.net/#/login)
- __bt3__: (http://d3qlp63uvn7mym.cloudfront.net/#/login)
- __bt4__: (https://d27qw8wmralg66.cloudfront.net/#/login)
- __bt5__: (http://d1n8gq8jhttzm1.cloudfront.net/#/login)
- __bt6__: (https://d1g3itmbvm82co.cloudfront.net/#/login)

To deploy some branch in one environment use the name of environment like a suffix in the branch name.

### Example
__feature/PBBDB-1234/new-login_st__

________
## Branch naming<a name="id2"></a>
Use the following convention for naming branch´s  

__feature:__ for new feature  
__fix:__ for solve some bug


- feature/[__code_jira_history__]/[__short_description__]  
- fix/[__code_jira_history__]/[__short_description__]    

### Example

__feature/PBBDB-1234/new-login__  
__fix/PBBDB-5678/fix-some-error__
_____________

## Code Rules<a name="id3"></a>  
The code quality of the project is responsibility of all team members, each developer 
has to check his code before to create a pull-request and later at least two member must review the code 
to keep a clean code.  

- Not write console.log.  
- Not leave debuggers.  
- Not comments in functions to explain his purpose.  
- Type explicitly all variables.
- Set the access modifiers for all variables and functions (private, public).  
- Set the returned type for all functions if not return anything set :void.
- Apply clean code for write code.

__________________

## Project Rules<a name="id4"></a>

- Not use local storage and session storage to keep new data instead think how use __NGRX__.
- All http service need to be created like a service in "src/new-app/core/services-apis/" the services are organized 
  with backend domain apis, if don´t know the architecture please talk with old members team

__________________



import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('client:userManagement', Application.makePath('app/Project/Client/UserManagement/Views'))

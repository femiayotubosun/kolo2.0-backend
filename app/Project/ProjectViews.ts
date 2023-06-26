import { DateTime } from 'luxon'
import View from '@ioc:Adonis/Core/View'

const currentDateTime = DateTime.now()
const currentYear = currentDateTime.year
View.global('currentYear', () => `${currentYear}`)

import './Client/ClientViews'

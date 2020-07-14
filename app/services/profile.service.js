const userService = require('../services/user.service')
const geoService = require('../services/geo.service')

const Profile = require('../models/profile.model')
const log4js = require ('log4js')
const logger = log4js.getLogger('services')

module.exports = {
  getByUserId,
  create,
  update
}

async function getByUserId(user_id) {
  
  logger.info(`Fetching profile of user with id ${user_id}.`)
  return await Profile.findOne({
    user_id: user_id
  })
}

async function create({ user_id, firstName, lastName}) {
  const profile = new Profile({
    user_id,
    firstName,
    lastName
  })

  // save profile
  await profile.save()
  
  logger.info(`Created a new profile for ${firstName} ${lastName}. (ID: ${user_id})`)
}

async function update(user_id, profileParam) {
  const profile = await this.getByUserId(user_id)

  // validate
  if (!profile) throw 'Perfil no encontrado'
  
  if (profileParam.address) {
    const geo = await geoService.create({
      address: profileParam.address,
      type: 'CUSTOMER'
    })

    profileParam.geo_id = geo._id
  }

  // copy userParam properties to user
  Object.assign(profile, profileParam)

  await profile.save()
  logger.info(`User with id ${user_id} has updated its profile data.`)
}

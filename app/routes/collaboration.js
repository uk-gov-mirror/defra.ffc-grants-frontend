const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/productivity',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'collaboration',
      name: 'collaboration',
      fieldset: {
        legend: {
          text: 'Will water be supplied to other farms?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text:
          'If you intend to supply water via a water sharing agreement as a result of this project.'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/collaboration',
    handler: (request, h) => {
      const collaboration = request.yar.get('collaboration')
      const data = collaboration || null
      return h.view('collaboration', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/collaboration',
    options: {
      validate: {
        payload: Joi.object({
          collaboration: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('collaboration', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('collaboration', request.payload.collaboration)
        return h.redirect('./score')
      }
    }
  }
]

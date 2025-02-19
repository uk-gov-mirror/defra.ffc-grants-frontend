const Joi = require('joi')
const { isChecked, getPostCodeHtml, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { POSTCODE_REGEX } = require('../helpers/regex-validation')

function createModel (errorMessage, data, postcodeHtml) {
  return {
    backLink: 'legal-status',
    radios: {
      idPrefix: 'inEngland',
      name: 'inEngland',
      fieldset: {
        legend: {
          text: 'Is the planned project in England?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: postcodeHtml
          },
          checked: isChecked(data, 'Yes')
        },
        {
          value: 'No',
          text: 'No',
          checked: isChecked(data, 'No')
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: '/country',
    messageContent: 'This is only for projects in England.<br/> Scotland, Wales and Northern Ireland have similar grants available.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/country',
    handler: (request, h) => {
      const inEngland = request.yar.get('inEngland') || null
      const postcodeData = inEngland !== null ? request.yar.get('projectPostcode') : null
      const postcodeHtml = getPostCodeHtml(postcodeData)

      return h.view('country', createModel(null, inEngland, postcodeHtml))
    }
  },
  {
    method: 'POST',
    path: '/country',
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required(),
          projectPostcode: Joi.string().regex(POSTCODE_REGEX).trim().allow('')
        }),
        failAction: (request, h, err) => {
          const { inEngland, projectPostcode } = request.payload
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), inEngland ? errorMessage : null)

          return h.view(
            'country',
            createModel(
              !inEngland ? errorMessage : null,
              inEngland,
              postcodeHtml
            )
          ).takeover()
        }
      },
      handler: (request, h) => {
        const { inEngland, projectPostcode } = request.payload
        if (inEngland === 'Yes' && projectPostcode.trim() === '') {
          const postcodeHtml = getPostCodeHtml(projectPostcode.toUpperCase(), 'Enter a postcode, like AA1 1AA')
          return h.view(
            'country',
            createModel(null, inEngland, postcodeHtml)
          ).takeover()
        }

        request.yar.set('inEngland', inEngland)
        request.yar.set('projectPostcode', projectPostcode.toUpperCase())
        return inEngland === 'Yes' ? h.redirect('./project-start') : h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]

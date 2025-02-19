const lookupErrorText = require('./lookupErrorText')
const { GRANT_PERCENTAGE } = require('../helpers/grant-details')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    if (typeof (label) === 'string') {
      return {
        value: label,
        text: label,
        checked: isChecked(data, label),
        selected: data === label
      }
    }

    const { text, value } = label
    return {
      value,
      text,
      checked: isChecked(data, value),
      selected: data === value
    }
  })
}

function getPostCodeHtml (postcodeData, error) {
  const postcode = postcodeData || ''

  return !error
    ? `<div>
        <label class="govuk-label" for="projectPostcode">
          In which postcode will the project take place?<br/><br/> Postcode
        </label>
        <input class="govuk-input govuk-!-width-one-third" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
    : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="projectPostcode">
          In which postcode will the project take place?<br/><br/> Postcode
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span> 
          ${error} 
        </span>
        <input class="govuk-input govuk-!-width-one-third govuk-input--error" autocomplete="off" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
}

function errorExtractor (data) {
  const { details } = data
  const errorObject = {}

  details.forEach((detail) => {
    if (detail.path.length > 0) {
      const errorKey = detail.path.join().replace(/,/gi, '.')
      errorObject[errorKey] = `error.${errorKey}.${detail.type}`
    } else if (detail.context.label) {
      errorObject[detail.context.label] = `error.${detail.context.label}.${detail.type}`
    }
  })

  return errorObject
}

function getErrorMessage (object) {
  return lookupErrorText(object[Object.keys(object)[0]])
}

function getGrantValues (projectCost) {
  const calculatedGrant = Number(GRANT_PERCENTAGE * projectCost / 100).toFixed(2)
  const remainingCost = Number(projectCost - calculatedGrant).toFixed(2)

  return { calculatedGrant, remainingCost }
}

function isInteger (number) {
  // NOT using Number.isInteger() because
  //  - not working on Internet Explorer
  //  - Number.isInteger(40000.00) === false ( instead of true )

  return (number - Math.floor(number)) === 0
}

function formatUKCurrency (costPounds) {
  return (isInteger(costPounds))
    ? Number(costPounds).toLocaleString('en-GB')
    : Number(costPounds).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatApplicationCode (guid) {
  return `WM-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}
function itemInObject (object, item) {
  return (
    !!object && Object.keys(object).includes(item)
  )
}

function fetchObjectItem (object, item) {
  return (
    !!object && Object.keys(object).includes(item) && object[item]
  ) || null
}

function fetchListObjectItems (object, itemsList) {
  if (!object) {
    return itemsList.map(item => null)
  }

  return (itemsList.map(item => (
    (Object.keys(object).includes(item) && object[item]) || null
  )))
}

function findErrorList ({ details }, inputFields) {
  const errorCodes = inputFields.map(input => {
    const foundErrorList = details.filter(({ context: { label: valLabel } }) => (valLabel === input))

    if (foundErrorList.length === 0) { return null }

    const { type, context: { label } } = foundErrorList[0]
    return (`error.${label}.${type}`)
  })

  return errorCodes.map(err => (
    err === null
      ? null
      : lookupErrorText(err)
  ))
}

module.exports = {
  isChecked,
  setLabelData,
  getPostCodeHtml,
  errorExtractor,
  getErrorMessage,
  getGrantValues,
  formatUKCurrency,
  itemInObject,
  fetchObjectItem,
  fetchListObjectItems,
  findErrorList,
  formatApplicationCode
}

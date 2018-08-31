const {ActivityIndicator, Button, TextView, ui} = require('tabris')

function createTextView (text) {
  new TextView({
    left: 16, right: 16, top: 'prev() 12',
    text: text,
    markupEnabled: true,
    class: 'timeData'
  }).appendTo(ui.contentView)
}

function createReloadButton () {
  new Button({
    left: 16, right: 16, top: 'prev() 12',
    text: 'Reload time',
    id: 'reloadButton'
  }).on('select', loadData).appendTo(ui.contentView)
}

function loadData () {
  // Dispose existing elements via the class selector
  ui.contentView.children('.timeData').dispose()
  ui.contentView.children('#reloadButton').dispose()

  // Create loading indicator
  let activityIndicator = new ActivityIndicator({
    centerX: 0, centerY: 0
  }).appendTo(ui.contentView)

  // Run async remote request with fetch
  fetch('http://vnezapno.pro/tabris-api.php')
    .then((response) => {
      // Check to see if the response status code is 200-299
      if (!response.ok) {
        throw response.statusText
      }
      return response.json()
    })
    .then((json) => {
      // Check that the response contains a success status
      if (json.status !== 'success') {
        throw new Error(json.status || 'Response was not successful')
      }

      // Show the time
      createTextView('The time is: ' + json.time)

      // Create the reload button
      createReloadButton()
    }).catch((err) => {

    // On error, show what went wrong and reload button
    createTextView('Failure: ' + (err || 'Error loading time data'))
    createReloadButton()
  }).then(() => {
    // This block always executes, regardless of success or failure
    // Dispose of the activity loader via direct reference
    activityIndicator.dispose()
  })
}

loadData()
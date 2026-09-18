// Minimal ambient typing for the reCAPTCHA v2 widget global, loaded via
// the external <script src="https://www.google.com/recaptcha/api.js"> tag.
interface Window {
  grecaptcha?: {
    getResponse: (widgetId?: number) => string
    reset: (widgetId?: number) => void
  }
}

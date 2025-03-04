/**
 * If the promise fails, log the underlying error but maintain the failed
 * promise.
 *
 * Does nothing to successful promises.
 */
export default function logPromiseFailure<T>(promise: Promise<T>) {
  promise.catch((error) => {
    console.error(error)
    throw error
  })
}

import type { StorageBucket } from '~~/shared/constants'
import { ERROR_MESSAGE, STORAGE_BUCKETS } from '~~/shared/constants'

const DEFAULT_SIGNED_URL_EXPIRY_SECONDS = 60 * 5 // 5 minutes

/**
 * Ensures the 3 storage buckets exist in Supabase Storage.
 */
export async function ensureStorageBuckets() {
  const admin = useSupabaseAdmin()

  const buckets: { id: StorageBucket; public: boolean }[] = [
    { id: STORAGE_BUCKETS.publicPreviews, public: true },
    { id: STORAGE_BUCKETS.commissionReferences, public: false },
    { id: STORAGE_BUCKETS.digitalDeliverables, public: false }
  ]

  for (const bucket of buckets) {
    const { data } = await admin.storage.getBucket(bucket.id)
    if (!data) {
      await admin.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: 50 * 1024 * 1024 // 50 Mb
      })
    }
  }
}

/**
 * Uploads a file to a Supabase Storage bucket.
 * For public buckets, returns the public URL, for private buckets, returns the internal file path.
 */
export async function uploadStorageFile(options: {
  bucket: StorageBucket
  path: string
  file: Buffer | Uint8Array | ArrayBuffer | Blob
  contentType?: string
  upsert?: boolean
}) {
  const admin = useSupabaseAdmin()

  const { data, error } = await admin.storage
    .from(options.bucket)
    .upload(options.path, options.file, {
      contentType: options.contentType,
      upsert: options.upsert ?? false
    })

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || ERROR_MESSAGE.storage.uploadFailed
    })
  }

  // get public url
  if (options.bucket === STORAGE_BUCKETS.publicPreviews) {
    const { data: publicUrlData } = admin.storage.from(options.bucket).getPublicUrl(data.path)
    return {
      path: data.path,
      url: publicUrlData.publicUrl
    }
  }

  // get private internal path
  return {
    path: data.path,
    url: null
  }
}

/**
 * Generates a short-lived signed download URL for a file in a private bucket.
 */
export async function createSignedDownloadUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = DEFAULT_SIGNED_URL_EXPIRY_SECONDS
) {
  const admin = useSupabaseAdmin()

  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, expiresInSeconds, {
    download: true
  })

  if (error || !data?.signedUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || ERROR_MESSAGE.storage.downloadFailed
    })
  }

  return data.signedUrl
}

/**
 * Generates a signed upload URL so an authenticated client can upload directly to a bucket.
 */
export async function createSignedUploadUrl(bucket: StorageBucket, path: string) {
  const admin = useSupabaseAdmin()

  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path)

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || ERROR_MESSAGE.storage.uploadFailed
    })
  }

  return {
    path: data.path,
    token: data.token,
    signedUrl: data.signedUrl
  }
}

/**
 * Deletes one or more files from a Supabase Storage bucket.
 */
export async function deleteStorageFiles(bucket: StorageBucket, paths: string[]) {
  if (!paths.length) return

  const admin = useSupabaseAdmin()
  const { error } = await admin.storage.from(bucket).remove(paths)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || ERROR_MESSAGE.storage.deleteFailed
    })
  }
}

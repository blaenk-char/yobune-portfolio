type GalleryItem = {
  title: string
  image: string
}

type WorkConfig = {
  timelapse: {
    title: string
    video: string
  }
  quality: {
    title: string
    low: string
    high: string
  }
  process: {
    title: string
    items: GalleryItem[]
  }
}

export const WORK_CONFIG: WorkConfig = {
  timelapse: {
    title: 'Timelapse',
    video:
      'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/verified/RNMWEFXTHDKO/26d50697-3a68-4dc3-b7e0-c2530274d7d5.webm'
  },
  quality: {
    title: 'Full HD vs UHD',
    low: 'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/verified/C29UE92RJKCI/3019a6af-2b76-4546-b0c2-84b3ee4a90a8.webp',
    high: 'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/portfolio/100e6662-bd27-4a11-9c15-5c48a147d008.webp'
  },
  process: {
    title: 'Work Process',
    items: [
      {
        title: 'First Step',
        image:
          'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/verified/HM8PHRKAHQCR/70901a93-daef-44d5-9aec-c3488e6747c1.webp'
      },
      {
        title: 'Second Step',
        image:
          'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/verified/YP7DP5PVVUU2/9db90ad1-7f97-432a-a5de-d2cc9e88d5bb.webp'
      },
      {
        title: 'Third Step',
        image:
          'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/verified/KTQ12A7KRW78/1e96742e-5475-40c0-8f1b-3fab54e6202b.webp'
      }
    ]
  }
}

import { PAGES } from './pages'

export enum DialogId {
  Animations = 'animations',
  Banners = 'banners',
  Characters = 'characters',
  End = 'end',
  Images = 'images',
  Intro = 'intro',
  Nsfw = 'nsfw',
  Work = 'work'
}

type DialogConfig = {
  storageKey: string // key for cookie
  speed: number
  image: string // dialog character
  resetLabel: string
  disableActionLabel: string
  defaultActionLabel: string
  pages: string[]
}

export type DialogRecord = {
  id: DialogId
  dialog: string
  actionLabel?: string // empty for defaultActionLabel in configs
}

export const DIALOG_CONFIG: DialogConfig = {
  storageKey: 'blaenk-dialog-active',
  resetLabel: 'Reset Pinky',
  defaultActionLabel: 'Continue',
  disableActionLabel: 'Turn off',
  speed: 15,
  image:
    'https://storage.vgen.co/uploads/6688ae01-b0ab-494a-b95f-8debacc4d4d0/avatars/c994765a-609b-4db2-ad2a-fb476a540298.webp',
  pages: [PAGES.home.url]
}

export const DIALOGS: DialogRecord[] = [
  {
    id: DialogId.Intro,
    dialog:
      "Welcome to the world of YobuneArt! I'm Pinky, your tour guide! Would you like me to show you around? :3",
    actionLabel: 'Start the Tour'
  },
  {
    id: DialogId.Banners,
    dialog:
      'Here are some animated banners I created! They are very loooooong, which is perfect for Discord, Twitch or Youtube! :O'
  },
  {
    id: DialogId.Animations,
    dialog: 'Of course I do other types of animations as well. Anything your heart desires! c:'
  },
  {
    id: DialogId.Characters,
    dialog:
      'I also do character sheets! I am always ready if you need to create a creative visualization of your original character! >:3'
  },
  {
    id: DialogId.Images,
    dialog: 'There is a lot more, but here are some of my favorite images I created! :3'
  },
  {
    id: DialogId.Nsfw,
    dialog:
      "I also do spicy stuff! It's blurred because I am family friendly of course. But you can turn on NSFW above... pervert. x.x"
  },
  {
    id: DialogId.Work,
    dialog: "If you're interested, you can also see how exactly I work and treat my drawings! òwó"
  },
  {
    id: DialogId.End,
    dialog: "So that's the end of the line, I hope you had fun during your stay! =w=",
    actionLabel: 'Finish'
  }
]

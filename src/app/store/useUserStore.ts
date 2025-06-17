'use client'
import { create } from 'zustand'

interface UserState {
  uid: string
  name: string
  setUid: (uid: string,name:string) => void
  init: () => void
}

export const useUserStore = create<UserState>((set) => ({
  uid: '',
  name: '',
  setUid: (uid: string,name:string) => {
    localStorage.setItem('uid', uid)
    localStorage.setItem('name', name)
    set({ uid })
  },

  init: () => {
    const stored = localStorage.getItem('uid')
    const name = localStorage.getItem('name')
    if (stored && name) set({ uid: stored,name:name })
  },
}))
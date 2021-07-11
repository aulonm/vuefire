import firebase from 'firebase'
import { mount } from '@vue/test-utils'
import { rtdbPlugin } from '../../../src'
import { generateRandomID, initFirebase } from '../../src'

beforeAll(() => {
  initFirebase()
})

function createMixins() {
  const db = firebase.database().ref(generateRandomID())
  //db.autoFlush()

  const docs = [
    db.child('1'),
    db.child('2'),
    db.child('3'),
    db.child('4'),
    db.child('5'),
    db.child('6'),
  ]

  const mWithObjA = {
    data: () => ({ a: null, b: null }),
    firebase: {
      a: docs[0],
      b: docs[1],
    },
  }

  const mWithObjB = {
    data: () => ({ a: null, c: null }),
    firebase: {
      // NOTE: probably because of the mock, Vue seems to be trying to merge the
      // objects and it results in a stack overflow but it works on a regular example
      a: docs[2],
      c: docs[3],
    },
  }

  const mWithFn = {
    firebase() {
      return {
        a: docs[4],
        c: docs[5],
      }
    },
  }

  return { mWithFn, mWithObjA, mWithObjB, docs }
}

const globalMountingOptions = {
  global: {
    plugins: [rtdbPlugin],
  },
}

describe('RTDB: merging', () => {
  it.skip('should merge properties', () => {
    const { mWithObjA, mWithObjB, docs } = createMixins()
    const { vm } = mount(
      {
        template: 'no',
        // @ts-ignore
        mixins: [mWithObjA, mWithObjB],
      },
      globalMountingOptions
    )
    expect(Object.keys(vm.$firebaseRefs)).toEqual(['a', 'b', 'c'])
    expect(vm.$firebaseRefs).toEqual({
      a: docs[2],
      b: docs[1],
      c: docs[3],
    })
  })

  it('supports function syntax', () => {
    const { docs, mWithFn } = createMixins()
    const { vm } = mount(
      {
        template: 'no',
        mixins: [mWithFn],
      },
      globalMountingOptions
    )
    expect(vm.$firebaseRefs).toEqual({
      a: docs[4],
      c: docs[5],
    })
  })

  it.skip('should merge two functions', () => {
    const { docs, mWithFn, mWithObjA, mWithObjB } = createMixins()
    const { vm } = mount(
      {
        template: 'no',
        // @ts-ignore
        mixins: [mWithObjA, mWithObjB, mWithFn],
      },
      globalMountingOptions
    )
    expect(vm.$firebaseRefs).toEqual({
      a: docs[4],
      b: docs[1],
      c: docs[5],
    })
  })
})

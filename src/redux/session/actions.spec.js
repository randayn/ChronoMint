import Immutable from 'immutable'
import ProfileModel from 'models/ProfileModel'
// import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { accounts, mockStore } from 'specsInit'
import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'
import * as a from './actions'
import { WATCHER, WATCHER_CBE } from 'redux/watcher/actions'

let store

const profile = new ProfileModel({name: 'profile1'})
// TODO let userProfile: ProfileModel

const REPLACE_METHOD = 'replace'
const MOCK_LAST_URL = '/test-last-url'

const routerAction = (route, method = 'push') => ({
  type: '@@router/CALL_HISTORY_METHOD',
  payload: {args: [route], method}
})

const emptySessionMock = new Immutable.Map({})

const cbeSessionMock = new Immutable.Map({
  session: {
    isSession: true,
    account: accounts[0]
  }
})

const userSessionMock = new Immutable.Map({
  session: {
    isSession: true,
    account: accounts[5]
  }
})

describe('session actions', () => {
  // TODO
  // beforeAll(async () => {
  //   const dao = await contractsManagerDAO.getUserManagerDAO()
  //   userProfile = await dao.getMemberProfile(accounts[0])
  // })

  beforeEach(() => {
    // override common cbe session
    ls.destroySession()
  })

  it('should create session', () => {
    store = mockStore(emptySessionMock)
    store.dispatch(a.createSession(accounts[0]))
    expect(store.getActions()).toEqual([
      {type: a.SESSION_CREATE, account: accounts[0]}
    ])
  })

  it('should destroy session', () => {
    store = mockStore(emptySessionMock)
    store.dispatch(a.destroySession())
    expect(store.getActions()).toEqual([
      {type: a.SESSION_DESTROY}
    ])
  })

  it('should not login without session', async () => {
    store = mockStore(emptySessionMock)
    let error = null
    try {
      await store.dispatch(a.login(accounts[0]))
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
  })

  it('should not update profile without session', async () => {
    store = mockStore(emptySessionMock)
    let error = null
    try {
      await store.dispatch(a.updateUserProfile(accounts[0]))
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()
  })

  it('should update profile', async () => {
    const store = mockStore(cbeSessionMock)
    ls.createSession(accounts[1], LOCAL_ID, LOCAL_ID)
    await store.dispatch(a.updateUserProfile(profile))

    expect(store.getActions()).toEqual([
      {type: a.SESSION_PROFILE_FETCH},
      {type: a.SESSION_PROFILE_UPDATE, profile},
      {type: a.SESSION_PROFILE_FETCH}
    ])
  })

  it('should login CBE and start watcher with cbeWatcher and go to last url', async () => {
    store = mockStore(cbeSessionMock)
    ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    ls.setLastURL(MOCK_LAST_URL)
    store.clearActions()
    await store.dispatch(a.login(accounts[0]))

    const actions = store.getActions()
    expect(actions).toContainEqual({type: a.SESSION_PROFILE_FETCH})
    // TODO expect(actions).toContainEqual({type: a.SESSION_PROFILE, profile: userProfile, isCBE: true})
    expect(actions).toContainEqual({type: WATCHER})
    expect(actions).toContainEqual({type: WATCHER_CBE})
    expect(actions).toContainEqual(routerAction(MOCK_LAST_URL, REPLACE_METHOD))
  })

  it('should login CBE and go to default page (/cbe)', async () => {
    store = mockStore(cbeSessionMock)
    ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    await store.dispatch(a.login(accounts[0]))

    const actions = store.getActions()
    expect(actions).toContainEqual({type: a.SESSION_PROFILE_FETCH})
    // TODO expect(actions).toContainEqual({type: a.SESSION_PROFILE, profile: userProfile, isCBE: true})
    expect(actions).toContainEqual({type: WATCHER})
    expect(actions).toContainEqual({type: WATCHER_CBE})
    expect(actions).toContainEqual(routerAction(a.DEFAULT_CBE_URL, REPLACE_METHOD))
  })

  it('should login USER and go to default url (/profile)', async () => {
    store = mockStore(userSessionMock)
    ls.createSession(accounts[5], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    await store.dispatch(a.login(accounts[5]))

    const actions = store.getActions()
    expect(actions).toContainEqual({type: a.SESSION_PROFILE_FETCH})
    expect(actions).toContainEqual({type: a.SESSION_PROFILE, profile: new ProfileModel(), isCBE: false})
    expect(actions).toContainEqual({type: WATCHER})
    expect(actions).not.toContainEqual({type: WATCHER_CBE})
    expect(actions).toContainEqual(routerAction(a.DEFAULT_USER_URL, REPLACE_METHOD))
  })

  it('should logout', async () => {
    store = mockStore(userSessionMock)
    ls.createSession(accounts[5], LOCAL_ID, LOCAL_ID)
    store.clearActions()

    await store.dispatch(a.logout())

    expect(store.getActions()).toEqual([
      {type: a.SESSION_DESTROY},
      routerAction('/login')
    ])
  })
})

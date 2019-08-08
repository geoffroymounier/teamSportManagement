import React , { useState, useEffect } from 'react';
import {Main} from './layout'
import UserAvatar from '../components/avatars/user'

function User(props) {
    return (
      <Main className={'main'}>
        <UserAvatar />
      </Main>
)
}


export default User;

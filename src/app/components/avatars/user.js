import React , { useState, useEffect } from 'react';

function UserAvatar(props) {
    const {firstName,lastName,licence,createdAt,teams} = props.user || []
    return (
      <div className='userInfo'>
        <div className='container wrap' style={{height:"100%"}}>
          <div style={{flex:3}}>
            <img  alt="complex" src="https://source.unsplash.com/random" />
          </div>
          <div style={{flex:9, padding:"0 1em"}}>
              <div>
                <h2>
                  NOM COMPLET : {firstName} {lastName}
                </h2>
                <h3>
                  LICENSE : {licence}
                </h3>
                <h3>
                  EQUIPE :
                  <ul>
                    {(teams || []).map(t=>(
                      <li>{t.teamId}</li>
                    )
                    )}
                  </ul>

                </h3>
              </div>
          </div>
          {props.isSelf &&
            <div className={'button'} style={{}}>
              <button>Deconnexion</button>
            </div>
          }
        </div>
      </div>
    )
}


export default UserAvatar;

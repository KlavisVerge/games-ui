import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import 'api-nav/api-nav.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-spinner/paper-spinner.js';

/**
 * @customElement
 * @polymer
 */
class GamesUiApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        body {
          font-family: sans-serif;
        }

        .horizontal {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
          padding: 15px 0px 15px 0px;
        }

        .vertical {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 0px 15px 0px;
        }

        .spinner {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }

        .overlay {
          background: #edeef0;
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          z-index: -1;
        }

        a {
          text-decoration: none;
          color: var(--paper-blue-900);
        }

        p {
          font-size: 1.125rem;
        }

        paper-card {
          min-width: 250px;
        }

        paper-spinner {
          padding: 0;
          max-width: 0;
          max-height: 0;
        }
        
        paper-spinner.active {
          max-width: initial;
          max-height: initial;
          height: 28px;
          width: 28px;
          margin: 0px 0px 0px -28px
        }

        api-nav {
          padding: 15px;
        }
      </style>
      <div class="overlay"></div>
      <div class="nav">
        <api-nav></api-nav>
      </div>
      <div class="vertical">
        <h1>Select a game to begin!</h1>
        <p>Welcome to the games landing page on <a href="https://statsplash.com">StatSplash</a>. Below are the various games currently implemented on the site. 
        They provide statistics, Twitch streams and hot Reddit posts with more to come! The site currently supports <a href="https://statsplash.com/games/fortnite">Fortnite</a>
         and <a href="https://statsplash.com/games/league-of-legends">League of Legends</a> with other games under construction.</p>
        <p>Have games you would like to see? Head over to our <a href="https://statsplash.com/about">about</a> page to make a suggestion.</p>
        <p>Have functionality you would like to see? You may also submit that to our team on the <a href="https://statsplash.com/about">about</a> page.</p>
      </div>
      <div class="spinner">
        <paper-spinner id="spinner" active=[[active]] class="active"></paper-spinner>
      </div>
      <div class="horizontal">
        <template is="dom-repeat" items="[[gameresponse]]">
          <paper-card>
            <a href=[[item.href]]>
              <h2>[[item.name]]</h2>
              <iron-image src="[[item.box_art_url]]"></iron-image>
            </a>
          </paper-card>
        </template>
      </div>
    `;
  }
  static get properties() {
    return {
      games: {
        type: Array,
        value: ["Fortnite", "League of Legends"]
      },
      active: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      gameresponse: {
        type: Array
      }
    };
  }

  ready() {
    super.ready();
    var url = 'https://3oemw4weak.execute-api.us-east-1.amazonaws.com/api/twitch-games';
      var data = {games: this.games};

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => {
        this.active = false;
        this.$.spinner.classList.remove('active');
        console.error('Error:', error);
      })
      .then(response => {
        // let res = JSON.parse(response);
        for(var i = 0; i < response.game.data.length; i++){
          response.game.data[i].box_art_url = response.game.data[i].box_art_url.replace('{width}', '170').replace('{height}', '226');
          if(this.games[0] === response.game.data[i].name){
            response.game.data[i].href = "https://statsplash.com/games/fortnite/"
          } else{
            response.game.data[i].href = "https://statsplash.com/games/league-of-legends/"
          }
        }
        this.gameresponse = response.game.data;
        this.active = false;
        this.$.spinner.classList.remove('active');
      });
  }
}

window.customElements.define('games-ui-app', GamesUiApp);

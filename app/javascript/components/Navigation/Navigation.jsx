import React, { useRef } from 'react';
import styles from '@stylesheets/Navigation.module.css';
import { useContent } from '@thoughtbot/superglue';

const AuthForm = () => {
  const { currentUser } = useContent();
  const token = document.querySelector("meta[name='csrf-token']").content;

  return (
    <div className={styles.authentication}>
      <form action="/authentications" acceptCharset="UTF-8" method="post">
        {currentUser ? (
          <div className={styles.signedIn}>
            <span>
              Signed in as{' '}
              <a href={'/user'} data-sg-visit>
                {currentUser.name}
              </a>
            </span>
            <input type="hidden" value="delete" name="_method" />
            <input type="hidden" value={token} name="authenticity_token" />
            <button name="commit" type="submit">
              Sign Out
            </button>
          </div>
        ) : (
          <div className={styles.signedOut}>
            <span>Not signed in</span>
            <input type="hidden" value={token} name="authenticity_token" />
            <label htmlFor="token">Token</label>
            <input
              id="token"
              type="text"
              name="user_token"
              placeholder="Enter token here"
              maxLength={32}
              required
            />
            <button name="commit" type="submit">
              Sign In
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default function Navigation({ links = [] }) {
  const navRef = useRef();

  const showNav = (event) => {
    const trigger = event.target;
    const nav = navRef.current;
    const navWidth = nav.getBoundingClientRect().width;

    navWidth > outerWidth
      ? nav.classList.add(styles.narrow)
      : nav.classList.remove(styles.narrow);

    const isExtended = nav.classList.toggle(styles.extended);
    const navBottom = nav.getBoundingClientRect().bottom;

    trigger.ariaLabel = `${isExtended ? 'Close' : 'Open'} navigation menu`;
    trigger.style.top = isExtended ? `${navBottom}px` : '9px';
    trigger.textContent = `${isExtended ? 'Close' : 'Open'} Menu`;
  };

  return (
    <nav className={styles.navigation} ref={navRef}>
      <button
        className={styles.trigger}
        aria-label="Open navigation menu"
        onClick={showNav}
      >
        Open Menu
      </button>
      {links.map((link, index) =>
        link.url ? (
          <a key={index} href={link.url} data-sg-visit>
            {link.content}
          </a>
        ) : (
          <div key={index}>{link.content}</div>
        )
      )}
      <AuthForm />
    </nav>
  );
}

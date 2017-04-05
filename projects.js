const template = (milestone) => `
  <span class="issue-meta-section css-truncate issue-milestone">
    <a class="milestone-link muted-link css-truncate" href="${milestone.html_url}">
      <svg aria-label="Milestone" class="octicon octicon-milestone" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14" style="vertical-align: text-top;">
        <path fill-rule="evenodd" d="M8 2H6V0h2v2zm4 5H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h10l2 2-2 2zM8 4H6v2h2V4zM6 16h2V8H6v8z" />
      </svg>
      <small class="css-truncate-target">
        ${milestone.title}
      </small>
    </a>
  </span>
`;

const request = (slug, type, id) => fetch(`https://api.github.com/repos/${slug}/${type}/${id}`)
  .then(response => response.json())
  .catch(err => console.error(err));

[...document.querySelectorAll('.project-card')]
  .map(el => {
    const $closed = el.querySelector('[aria-label="Closed Issue"]');

    if ($closed) {
      el.parentNode.removeChild(el);
      return;
    }

    const anchor = el.querySelector('a.h5[href]');

    if (!anchor) {
      return;
    }

    const [slug, type, id] = anchor.href.split(/https:\/\/github.com\/|\/(issues|pulls)\//).filter(Boolean);

    request(slug, type, id)
      .then(({ milestone }) => {
        if (!milestone) {
          return;
        }

        console.log(milestone);

        const fragment = document
          .createRange()
          .createContextualFragment(template(milestone));

        el.appendChild(fragment);
      });
  });

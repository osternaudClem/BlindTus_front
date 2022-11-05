import { useEffect, useRef, useState } from 'react';
import MuiMarkdown from 'mui-markdown';
import { Stack, Typography, Grid, Link } from '@mui/material';
import { Heading, PaperBox } from '../../components/UI';
import termsFile from '../../datas/pages/terms.md';

function Terms() {
  const [terms, setTerms] = useState(null);
  const [summary, setSummary] = useState([]);
  const contentRef = useRef();

  useEffect(() => {
    fetch(termsFile)
      .then((response) => response.text())
      .then(
        (text) => {
          setTerms(text);
        },
        [termsFile]
      );
  }, [setTerms]);

  useEffect(() => {
    const titles = contentRef.current.parentElement.getElementsByTagName('h3');
    if (summary.length === 0 && titles.length > 0) {
      // Get all h3 and add them to summary
      for (const property in titles) {
        if (titles[property].id) {
          setSummary((s) => [
            ...s,
            {
              id: titles[property].id,
              text: titles[property].textContent,
            },
          ]);
        }
      }
    }
  }, [contentRef, terms, summary.length]);

  return (
    <div className="PrivacyPage">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          md={4}
          display={{ sm: 'none', md: 'block' }}
        >
          <PaperBox
            style={{ position: 'sticky', top: '140px', paddingTop: '32px' }}
          >
            <Typography
              variant="h5"
              mb={2}
            >
              Sommaire:
            </Typography>
            {summary.map((item, key) => {
              return (
                <div key={key}>
                  <Link
                    href={`#${item.id}`}
                    color="inherit"
                    underline="hover"
                    sx={{ mb: '16px', display: 'block' }}
                  >
                    {item.text}
                  </Link>
                </div>
              );
            })}
          </PaperBox>
        </Grid>
        <Grid
          item
          sm={12}
          md={8}
        >
          <Grid container>
            <Grid
              item
              xs
            >
              <Stack
                direction="row"
                alignItems="center"
              >
                <Heading sx={{ mb: 0, flex: 1 }}>Mentions légales</Heading>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                >
                  Dernière révision : mardi 25 octobre 2022
                </Typography>
              </Stack>
              <div
                id="markdown-body"
                ref={contentRef}
              >
                <MuiMarkdown
                  overrides={{
                    h2: {
                      component: 'h3',
                    },
                    h3: {
                      component: 'h4',
                    },
                    h4: {
                      component: 'h5',
                    },
                  }}
                >
                  {terms}
                </MuiMarkdown>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Terms;

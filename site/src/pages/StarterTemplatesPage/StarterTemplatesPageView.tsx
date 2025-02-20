import { makeStyles } from "@mui/styles";
import { ErrorAlert } from "components/Alert/ErrorAlert";
import { Loader } from "components/Loader/Loader";
import { Margins } from "components/Margins/Margins";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "components/PageHeader/PageHeader";
import { Stack } from "components/Stack/Stack";
import { TemplateExampleCard } from "components/TemplateExampleCard/TemplateExampleCard";
import { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { combineClasses } from "utils/combineClasses";
import { StarterTemplatesByTag } from "utils/starterTemplates";

const getTagLabel = (tag: string) => {
  const labelByTag: Record<string, string> = {
    all: "All templates",
    digitalocean: "DigitalOcean",
    aws: "AWS",
    google: "Google Cloud",
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- this can be undefined
  return labelByTag[tag] ?? tag;
};

const selectTags = (starterTemplatesByTag: StarterTemplatesByTag) => {
  return starterTemplatesByTag
    ? Object.keys(starterTemplatesByTag).sort((a, b) => a.localeCompare(b))
    : undefined;
};
export interface StarterTemplatesPageViewProps {
  starterTemplatesByTag?: StarterTemplatesByTag;
  error?: unknown;
}

export const StarterTemplatesPageView: FC<StarterTemplatesPageViewProps> = ({
  starterTemplatesByTag,
  error,
}) => {
  const [urlParams] = useSearchParams();
  const styles = useStyles();
  const tags = starterTemplatesByTag
    ? selectTags(starterTemplatesByTag)
    : undefined;
  const activeTag = urlParams.get("tag") ?? "all";
  const visibleTemplates = starterTemplatesByTag
    ? starterTemplatesByTag[activeTag]
    : undefined;

  return (
    <Margins>
      <PageHeader>
        <PageHeaderTitle>Starter Templates</PageHeaderTitle>
        <PageHeaderSubtitle>
          Import a built-in template to start developing in the cloud
        </PageHeaderSubtitle>
      </PageHeader>

      {Boolean(error) && <ErrorAlert error={error} />}

      {Boolean(!starterTemplatesByTag) && <Loader />}

      <Stack direction="row" spacing={4}>
        {starterTemplatesByTag && tags && (
          <Stack className={styles.filter}>
            <span className={styles.filterCaption}>Filter</span>
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`?tag=${tag}`}
                className={combineClasses({
                  [styles.tagLink]: true,
                  [styles.tagLinkActive]: tag === activeTag,
                })}
              >
                {getTagLabel(tag)} ({starterTemplatesByTag[tag].length})
              </Link>
            ))}
          </Stack>
        )}

        <div className={styles.templates}>
          {visibleTemplates &&
            visibleTemplates.map((example) => (
              <TemplateExampleCard example={example} key={example.id} />
            ))}
        </div>
      </Stack>
    </Margins>
  );
};

const useStyles = makeStyles((theme) => ({
  filter: {
    width: theme.spacing(26),
    flexShrink: 0,
  },

  filterCaption: {
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: 12,
    color: theme.palette.text.secondary,
    letterSpacing: "0.1em",
  },

  tagLink: {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontSize: 14,
    textTransform: "capitalize",

    "&:hover": {
      color: theme.palette.text.primary,
    },
  },

  tagLinkActive: {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },

  templates: {
    flex: "1",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: theme.spacing(2),
    gridAutoRows: "min-content",
  },
}));

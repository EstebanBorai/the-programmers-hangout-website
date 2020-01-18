import { graphql, useStaticQuery } from "gatsby"
import { sort } from "ramda"
import React, { FC, HTMLAttributes } from "react"
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"
import useSidebar from "../../hooks/useSidebar"
import { IAllArchivesQuery, IFileOrFolder } from "../../types"
import { humanize } from "../../utils"
import { Sidebar } from "../Sidebar"
import useBuildTree from "./../../hooks/useBuildTree"
import * as SC from "./styles"

const ALL_ARCHIVES = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "what-is-archive" } }) {
      edges {
        node {
          relativePath
        }
      }
    }
  }
`

function Tree({ item }: { item: IFileOrFolder }) {
  const { setOpenOnMobile } = useSidebar()
  const { unlock } = useLockBodyScroll()

  return (
    <SC.PageLink
      key={item.title}
      to={item.path}
      activeClassName="active"
      onClick={() => {
        setOpenOnMobile(false)
        unlock()
      }}
    >
      {humanize(item.title)}
    </SC.PageLink>
  )
}

export const ArchivesSidebar: FC<HTMLAttributes<HTMLDivElement>> = props => {
  const archives = useStaticQuery<IAllArchivesQuery>(ALL_ARCHIVES)
  const tree = useBuildTree(archives, "/archives")
  const sortedTree = sort((a, b) => a.title.localeCompare(b.title), tree)

  return (
    <Sidebar {...props}>
      {sortedTree.map(node => (
        <Tree item={node} />
      ))}
    </Sidebar>
  )
}

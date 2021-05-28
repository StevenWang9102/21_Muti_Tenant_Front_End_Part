import React, { Component } from 'react';
import styles from './index.less';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tree, Input } from 'antd';
import { CategoriesTreeItem } from '../../data.d';
//import nprogress from 'nprogress';

const { TreeNode } = Tree;
const { Search } = Input;

export interface TreeNodeType extends Partial<CategoriesTreeItem> {
  key: string;
  value: string;
  title: string;
  children: TreeNodeType;
}

interface TreeDataProps {
  loading: boolean;
  gData: TreeNodeType[];
  handleSelectedTreeNode: (nodeKey: number, selected: boolean) => void;
}

interface TreeDataState {
  loading: boolean;
  dataList: [];
  expandedKeys: string[];
  searchValue: string;
  autoExpandParent: boolean;
}

class SearchTree extends Component<TreeDataProps, TreeDataState> {
  static defaultProps = {
    loading: true,
    data: [],
  };

  constructor(props: TreeDataProps) {
    super(props);
    this.state = {
      loading: false,
      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
    this.gList(props.gData);
  }


  gList = data => {
    const { dataList } = this.state;
    if (data == null) return;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, name } = node;
      dataList.push({ key, title: name });
      this.setState({
        dataList: dataList,
      });

      if (node.children) {
        this.gList(node.children);
      }
    }
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const { dataList } = this.state;
    const { gData } = this.props;

    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (key, e) => {
    const { handleSelectedTreeNode, setCurrentCategoryId} = this.props;
    console.log('onSelect key=', parseInt(key));
    console.log('onSelect gData=', this.props.gData);
    
    const category = this.props.gData.filter(each=> each.key == key)
    console.log('onSelect category=', category);
    setCurrentCategoryId(category[0] && category[0].id)
    handleSelectedTreeNode(key, e.selected);
  };

  render() {
    const { gData } = this.props;
    const { searchValue, expandedKeys, autoExpandParent, loading } = this.state;
    console.log("tree, gdata=",gData)

    const loopRender = data =>
      data.map(item => {
        console.log(item); //isInactive
        
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const color = item.isInactive? 'black': 'black'
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span style={{color: color}}>{item.title}</span>
          );

        if (item.children) {
          return (
            <TreeNode
              key={item.key}
              title={title}
              icon={({ selected }) => (
                <LegacyIcon
                  theme="filled"
                  style={{ color: item.color }}
                  type={selected ? 'tags' : 'tags'}
                />
              )}
            >
              {loopRender(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.key}
            title={title}
            icon={({ selected }) => (
              <LegacyIcon
                theme="filled"
                style={{ color: item.color }}
                type={selected ? 'tags' : 'tags'}
              />
            )}
          />
        );
      });

    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />

          <Tree
            showIcon
            style={{marginLeft: -100}}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            showLine={false}
            onSelect={this.onSelect}
            style={{ fontSize: '18px' }}
          >
            {loopRender(gData)}
          </Tree>
      </div>
    );
  }
}

export default SearchTree;

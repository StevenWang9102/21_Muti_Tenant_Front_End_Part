import React, { useEffect, useState, FC } from 'react'
import { Input } from 'antd';
import 'antd/dist/antd.css';
import styles from '../style.less';
import { formatMessage } from 'umi';
import {clearSpaces} from '../../../public-component/clearSpaces'

const { Search } = Input;

export const MySearch =  (props) => {

  const { searchValue, setSearchValue, searchMember, requestAllMembers} = props

  const mySearch = {
    position: "absolute",
    top: "30px",
    left: "40px",
    width: "240px",
    zIndex: 1,
  }

  return (
    <>
      <Search
        style={mySearch}
        placeholder="Search information"
        onSearch={(value) => {
          const keyword = clearSpaces(value)
          searchMember(keyword)
        }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        enterButton
      />

      <section
        className={styles.reset}
        onClick={() => {
          setSearchValue('');
          requestAllMembers()
        }}
      >
        Reset
      </section>
    </>
  )
}


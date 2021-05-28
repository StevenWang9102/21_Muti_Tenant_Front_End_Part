import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { unique } from '.././functions/unique'
import 'antd/dist/antd.css';

export const ImagePool = ({
  allImages,
  imagePoolVisible,
  dispatch,
  allImagePath,
  imageSelectedIndex,
  setImagePathFromLibrary,
  setImageSelectedIndex
}) => {
  const totalPageNumber = allImagePath.length

  const [currentPage, setCurrentPage] = useState(1)
  const [renderImages, setRenderImages] = useState([])
  const [imageError, setImageError] = useState([])
  const [galleryList, setGalleryList] = useState([])
  
  console.log('imgePool,allImages', allImages);
  console.log('imgePool,allImagePath', allImagePath);
  console.log('imgePool,renderImages', renderImages);

  let range1 = 0
  let range2 = 19


  useEffect(() => {
    setRenderImages(allImagePath.slice(range1, range2))
    // @@@@@@@@@@@@@@@@@@@@@@ fetchImageLibrary
    alert('请求gallery')
    dispatch({
      type: 'itemsData/fetchImageLibrary',
    });
  }, [])

  useEffect(() => {
    dispatch({
      type: 'itemsData/fetchItems',
    });
    setCurrentPage(1)
    setImageSelectedIndex(null)
  }, [imagePoolVisible])

  useEffect(() => {
    let range1 = 20 * (currentPage - 1) + 0
    let range2 = 20 * (currentPage - 1) + 19
    setRenderImages(allImagePath.slice(range1, range2))
  }, [currentPage])

  return (
    <section>
      <div>
        {unique(renderImages).map((each, index) => {
          console.log('each1661',each);
          const link = `http://beautiesapi.gcloud.co.nz/${each}`
          return (
            <>
             {
              imageError[index] == 'error' ? null : <img
                style={imageSelectedIndex == index ? { width: '160px', height: '160px', margin: 10, border: '4px solid lightgray' } : { width: '160px', height: '160px', margin: 10 }}
                src={link}
                onError={() => {
                  const temp = { ...imageError, [index]: 'error' }
                  setImageError(temp)
                }}
                alt='img'
                onClick={() => {
                  // 仅在这里选中目标URL
                  setImagePathFromLibrary(each)
                  setImageSelectedIndex(index)
                }}
              />
            }
            </>

          )
        })}
      </div>

      <div>
        <Pagination
          style={{ float: 'right', marginTop: 10 }}
          onChange={(page) => { setCurrentPage(page) }}
          defaultCurrent={1}
          total={totalPageNumber}
          showSizeChanger={false}
          defaultPageSize={20}
        />
      </div>

    </section>
  );
};


import {Request, Response} from 'express';


// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /auth': async (req: Request, res: Response) => {
    const {password, username} = req.body;

    if (password === '123456' && username === 'admin') {
      res.send({
        code: 0,
        msg: "",
        data: {
          token: 'eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYxMDQ0NDMwNSwiaWF0IjoxNjA5ODM5NTA1fQ',
          name:'admin',

        }
      });
      return;
    }

    res.send({
      code: 1,
      msg: ''
    });
  }
}

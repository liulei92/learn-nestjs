import { Controller, Post, Get, Req, Res, HttpCode, HttpStatus, Headers, Query, Param, Redirect } from '@nestjs/common';
import { Request, Response } from 'express'
type ListType = {
  from: string
}
type urlObj = { url: string }

@Controller('cats')
export class CatsController {
  // post /cats
  @Post()
  // @HttpCode(400) // 状态码
  // @Headers('Cache-Control', 'none') 自定义响应头 或者使用 res.header()
  // @Redirect('https://nestjs.com', 301) 重定向 或者使用 res.redirect()
  create(): string {
    return 'This action adds a new cat';
  }
  // get /cats.docs?version=5
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string): urlObj {
    console.log(version)
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' } // 可以使用返回的值方式 覆盖 @Redirect()
    }
    return { url: 'https://docs.nestjs.com' }
  }

  // 路由参数
  @Get('list/:id')
  findListId(@Param('id') id: string): any {
    // console.log(res)
    return `This action returns a #${id} cat`;
    // return res.status(HttpStatus.OK).json([])
  }



  // get /cats/abecd
  @Get('ab*cd')
  findOne(): string {
    return 'this route uses a wildcard'
  }
  // cats
  @Get()
  findAll(@Req() request: Request): string {
    // console.log(request.params)
    // console.log(request.query)
    // console.log(request.body)
    console.log(request.url)
    // console.log(request.route)
    // console.log(request.originalUrl)
    // console.log(request.host)
    // console.log(request.headers)
    return 'this action returns all cats'
  }
}
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



const users = [
  {
  image: "https://i.pinimg.com/736x/fc/5e/88/fc5e882feca95037897d47dca287fb0e.jpg",
  name: "hoailam"
},
{
  image: "https://i.pinimg.com/564x/32/69/f5/3269f5f22d6bd5421d904fe8488948b6.jpg",
  name: "hungho"
},
{
  image: "https://i.pinimg.com/736x/84/1c/ba/841cba903f10ecb76309897468a1619b.jpg",
  name: "tienlinh"
},
{
  image: "https://i.pinimg.com/736x/a4/4b/ee/a44bee0d2fb969c5f7958cf80355ac3a.jpg",
  name: "phuonghoang"
},
{
  image: "https://i.pinimg.com/564x/66/cc/a4/66cca48b74682a9bd120d7e99e2eca5d.jpg",
  name: "duongnguyen"
},
]

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {users.map((user, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img className="text-4xl font-semibold h-96 object-contain rounded-2xl" src={user.image}></img>
                  {/* <span className="text-4xl font-semibold">{user.image}</span> */}
                </CardContent>
              </Card>
            </div>

            <p className="text-2xl">User: {user.name}</p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default CarouselDemo


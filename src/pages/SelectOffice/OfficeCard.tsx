import React from "react"
import Lucide, { Icon } from "../../base-components/Lucide"
import { Link } from "react-router-dom"
import { officesIds } from "../../utils/officesIds"
import { icons } from "lucide"
import { capitalizeFirstLetter } from "../../utils/helper"

interface CardProps {
  title: string
  office: string
  type: "notificaciones" | "procuracion"
}
const OfficeCards = ({ title, office, type }: CardProps) => {
  const Officeicon = officesIds[office?.toUpperCase() as keyof typeof officesIds]?.icon ?? false
  const icon = Officeicon ?? "Bell"
  const colorCard = type === "notificaciones" ? "text-info" : "text-secondary"

  return (
    <Link
      to={`/${office}/${type}/`}
      className="block w-[100%] sm:w-[45%] md:w-[30%] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-10 pointer"
    >
      <Lucide icon={icon as Icon} className={`h-16 w-16 mr-2 ${colorCard}`} />
      <h5 className={`my-2 text-2xl font-bold tracking-tight text-primary`}>
        {capitalizeFirstLetter(title)}
      </h5>
    </Link>
  )
}

export default OfficeCards

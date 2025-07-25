export const LP_PURPOSES = {
  product: {
    id: 'product',
    label: {
      ja: '製品販売',
      en: 'Product Sales'
    },
    description: {
      ja: '製品の特徴と価値を伝えるLP',
      en: 'LP to convey product features and value'
    }
  },
  brand: {
    id: 'brand',
    label: {
      ja: 'ブランド・企業',
      en: 'Brand/Company'
    },
    description: {
      ja: '企業やブランドの信頼性を高めるLP',
      en: 'LP to enhance company or brand credibility'
    }
  },
  service: {
    id: 'service',
    label: {
      ja: 'サービス紹介',
      en: 'Service Introduction'
    },
    description: {
      ja: 'サービスの詳細と利点を説明するLP',
      en: 'LP to explain service details and benefits'
    }
  },
  lead: {
    id: 'lead',
    label: {
      ja: 'リード獲得',
      en: 'Lead Generation'
    },
    description: {
      ja: '見込み客の情報を収集するLP',
      en: 'LP to collect prospect information'
    }
  },
  event: {
    id: 'event',
    label: {
      ja: 'イベントプロモーション',
      en: 'Event Promotion'
    },
    description: {
      ja: 'イベントへの参加を促すLP',
      en: 'LP to encourage event participation'
    }
  }
} as const;

export type PurposeType = keyof typeof LP_PURPOSES;